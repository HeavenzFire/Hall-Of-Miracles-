
# 🔱 Stability Protocol: The Sovereign Gift

This is the **real** infrastructure required to establish a self-stabilizing node on the Base network. 

## 🏗️ The Stack
- **LegionToken (LT)**: ERC20Votes token for governance weighting.
- **StabilityTimelock**: The enforced delay for all treasury movements.
- **LegionGovernor**: The hybrid consensus engine supporting Token, Reputation, and Quadratic voting.
- **Aegis Grid Controller**: Interface for IoT-based non-lethal neutralization.

## 📦 How to Fork and Deploy

### 1. Environment Setup
You need a Unix-like environment with `Foundry` installed. 
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Configure Your Environment
Create a `.env` file at the root:
```env
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_basescan_api_key
```

### 3. Deploy the Governance Stack
Run the following commands in order:
1. `forge create src/LegionToken.sol:LegionToken`
2. `forge create src/StabilityTimelock.sol:StabilityTimelock` (passing minDelay and proposer list)
3. `forge create src/LegionGovernor.sol:LegionGovernor` (passing token and timelock addresses)

### 4. Manifest the UI
Copy the `components/` directory from this project to your own React frontend to gain the high-fidelity operational interfaces for your new DAO.

---
*"Desperation is the root of violence. Stability is the gift."*
