//! STEADY - Solana Autopilot Investing with Downside Protection
//!
//! This program provides automated downside protection for crypto portfolios.
//! When portfolio value drops 10% from its peak, the system automatically
//! switches to Safe mode to protect capital.
//!
//! Instructions:
//! 1. initialize_portfolio - Create user's portfolio account
//! 2. update_mode - Manually change investment mode
//! 3. check_and_protect_downside - Monitor portfolio and trigger protection

use anchor_lang::prelude::*;

declare_id!("5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc");

#[program]
pub mod steady {
    use super::*;

    /// Initialize a new portfolio for a user
    /// Creates a PDA account to track portfolio state and downside protection
    pub fn initialize_portfolio(ctx: Context<InitializePortfolio>) -> Result<()> {
        let portfolio = &mut ctx.accounts.portfolio;
        
        // Set the owner to the user who initialized
        portfolio.owner = ctx.accounts.owner.key();
        
        // Start in Safe mode by default for maximum protection
        portfolio.current_mode = InvestmentMode::Safe;
        
        // Initialize peak value to 0 (will be set on first value update)
        portfolio.last_peak_value = 0;
        
        // Store bump for future PDA verification
        portfolio.bump = ctx.bumps.portfolio;

        msg!("Portfolio initialized for owner: {}", portfolio.owner);
        msg!("Initial mode: Safe, Peak value: 0");
        
        Ok(())
    }

    /// Update the investment mode
    /// Only the portfolio owner can change their investment strategy
    pub fn update_mode(
        ctx: Context<UpdateMode>,
        new_mode: InvestmentMode,
    ) -> Result<()> {
        let portfolio = &mut ctx.accounts.portfolio;
        
        // Verify caller is the owner
        require!(
            ctx.accounts.owner.key() == portfolio.owner,
            SteadyError::Unauthorized
        );

        let old_mode = portfolio.current_mode;
        portfolio.current_mode = new_mode;

        msg!("Mode updated from {:?} to {:?}", old_mode, new_mode);
        
        Ok(())
    }

    /// Check portfolio value and trigger downside protection if needed
    /// 
    /// DOWNSIDE PROTECTION LOGIC:
    /// 1. If current value > last peak: Update peak (new high!)
    /// 2. If current value < last peak: Calculate drawdown percentage
    /// 3. If drawdown >= 10%: Automatically switch to Safe mode
    /// 
    /// This protects users from losing more than 10% from their peak value
    pub fn check_and_protect_downside(
        ctx: Context<CheckDownside>,
        current_value: u64,
    ) -> Result<()> {
        let portfolio = &mut ctx.accounts.portfolio;

        msg!("Checking downside protection...");
        msg!("Current value: {}, Last peak: {}", current_value, portfolio.last_peak_value);

        // Case 1: New peak value reached (portfolio growing)
        if current_value > portfolio.last_peak_value {
            portfolio.last_peak_value = current_value;
            msg!("New peak value set: {}", current_value);
            return Ok(());
        }

        // Case 2: Value dropped, check if protection needed
        if current_value < portfolio.last_peak_value {
            // Calculate drawdown percentage
            // Formula: drawdown% = ((peak - current) / peak) * 100
            let value_drop = portfolio.last_peak_value.checked_sub(current_value)
                .ok_or(SteadyError::MathOverflow)?;
            let drawdown_percentage = value_drop.checked_mul(100)
                .ok_or(SteadyError::MathOverflow)?
                .checked_div(portfolio.last_peak_value)
                .ok_or(SteadyError::MathOverflow)?;

            msg!("Drawdown detected: {}%", drawdown_percentage);

            // Trigger protection if drawdown >= 10%
            if drawdown_percentage >= 10 {
                let old_mode = portfolio.current_mode;
                portfolio.current_mode = InvestmentMode::Safe;
                
                msg!("⚠️ DOWNSIDE PROTECTION TRIGGERED!");
                msg!("Drawdown: {}% (threshold: 10%)", drawdown_percentage);
                msg!("Mode changed: {:?} -> Safe", old_mode);
                
                // Emit event for frontend notification
                emit!(DownsideProtectionTriggered {
                    owner: portfolio.owner,
                    drawdown_percentage,
                    peak_value: portfolio.last_peak_value,
                    current_value,
                    old_mode,
                });
            } else {
                msg!("Drawdown {}% is below 10% threshold. No action needed.", drawdown_percentage);
            }
        }

        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

/// Portfolio account - tracks investment mode and downside protection
#[account]
#[derive(InitSpace)]
pub struct Portfolio {
    /// Owner of this portfolio
    pub owner: Pubkey,
    
    /// Highest portfolio value achieved (used for drawdown calculation)
    pub last_peak_value: u64,
    
    /// Current investment strategy mode
    pub current_mode: InvestmentMode,
    
    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl Portfolio {
    /// Space is automatically calculated by InitSpace derive macro
    /// 8 (discriminator) + 32 (pubkey) + 8 (u64) + 1 (enum) + 1 (bump)
    pub const LEN: usize = 50;
}

// ============================================================================
// Investment Modes
// ============================================================================

/// Investment strategy modes with different risk profiles
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug, InitSpace)]
pub enum InvestmentMode {
    /// Safe: Conservative strategy, lowest risk
    /// - Focus on capital preservation
    /// - Lower returns, higher stability
    Safe,
    
    /// Balanced: Moderate risk/reward
    /// - Balanced approach between growth and safety
    /// - Medium returns, medium volatility
    Balanced,
    
    /// Growth: Aggressive strategy, highest risk
    /// - Maximum growth potential
    /// - Higher returns, higher volatility
    Growth,
}

// ============================================================================
// Context Structs
// ============================================================================

#[derive(Accounts)]
pub struct InitializePortfolio<'info> {
    /// Portfolio PDA account to be created
    #[account(
        init,
        payer = owner,
        space = Portfolio::LEN,
        seeds = [b"portfolio", owner.key().as_ref()],
        bump
    )]
    pub portfolio: Account<'info, Portfolio>,

    /// Owner who is creating the portfolio
    #[account(mut)]
    pub owner: Signer<'info>,

    /// System program for account creation
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMode<'info> {
    /// Portfolio account to update
    #[account(
        mut,
        seeds = [b"portfolio", owner.key().as_ref()],
        bump = portfolio.bump,
        has_one = owner @ SteadyError::Unauthorized
    )]
    pub portfolio: Account<'info, Portfolio>,

    /// Must be the portfolio owner
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct CheckDownside<'info> {
    /// Portfolio account to check and potentially update
    #[account(
        mut,
        seeds = [b"portfolio", portfolio.owner.as_ref()],
        bump = portfolio.bump
    )]
    pub portfolio: Account<'info, Portfolio>,

    /// Can be called by anyone (keeper/crank/owner)
    /// This allows automated monitoring systems to protect users
    pub caller: Signer<'info>,
}

// ============================================================================
// Events
// ============================================================================

/// Event emitted when downside protection is triggered
#[event]
pub struct DownsideProtectionTriggered {
    /// Portfolio owner affected
    pub owner: Pubkey,
    
    /// Drawdown percentage that triggered protection
    pub drawdown_percentage: u64,
    
    /// Peak value before drawdown
    pub peak_value: u64,
    
    /// Current value that triggered protection
    pub current_value: u64,
    
    /// Previous mode before switching to Safe
    pub old_mode: InvestmentMode,
}

// ============================================================================
// Custom Errors
// ============================================================================

#[error_code]
pub enum SteadyError {
    #[msg("Unauthorized: Only portfolio owner can perform this action")]
    Unauthorized,

    #[msg("Invalid value: Value must be greater than 0")]
    InvalidValue,

    #[msg("Calculation overflow")]
    MathOverflow,
}
