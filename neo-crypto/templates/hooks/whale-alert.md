# 🐋 WHALE ALERT TEMPLATE

## Hook Variations

### Type 1: Big Move
```
🚨 WHALE ALERT 🚨

[Wallet] just moved $[Amount] into [Token]

• From: [Source Wallet]
• To: [Destination Wallet]  
• Token: [Token Name] ([Symbol])
• Amount: $[Value] USD
• Time: [Timestamp]

This whale has a history of [past performance].
```

### Type 2: Accumulation
```
📈 WHALE ACCUMULATION DETECTED

[Wallet] has been accumulating [Token] for [Time Period]

• Total bought: $[Total Value]
• Average price: $[Avg Price]
• Current position: [Position Size]
• Unrealized P&L: [Profit/Loss]%

This is their [ordinal] largest position.
```

### Type 3: Distribution
```
📉 WHALE DISTRIBUTION DETECTED

[Wallet] is selling [Token] after [Gain]% profit

• Sold: $[Amount]
• Remaining: [Remaining Amount]
• Profit taken: $[Profit]
• Holding period: [Days] days

They bought at $[Entry] and sold at $[Exit].
```

### Type 4: New Wallet
```
🆕 NEW WHALE SPOTTED

Fresh wallet just made a $[Amount] move

• Wallet: [Address]
• Action: [Buy/Sell/Transfer]
• Token: [Token]
• Network: [Network]
• Time: [Time]

This wallet has [characteristic].
```

## Template Variables

- `[Wallet]` - Wallet address (shortened)
- `[Amount]` - Transaction amount in USD
- `[Token]` - Token name and symbol
- `[Source Wallet]` - Where it came from
- `[Destination Wallet]` - Where it went
- `[Timestamp]` - Time of transaction
- `[past performance]` - Whale's track record
- `[Time Period]` - How long they've been accumulating
- `[Total Value]` - Total USD value accumulated
- `[Avg Price]` - Average entry price
- `[Position Size]` - Size of current position
- `[Profit/Loss]` - Percentage gain/loss
- `[ordinal]` - 1st, 2nd, 3rd, etc.
- `[Gain]` - Percentage gain before selling
- `[Remaining Amount]` - Amount still held
- `[Profit]` - Profit taken in USD
- `[Days]` - Days held
- `[Entry]` - Entry price
- `[Exit]` - Exit price
- `[Address]` - Full wallet address
- `[Action]` - Type of transaction
- `[Network]` - Blockchain network
- `[Time]` - Relative time (e.g., "2 hours ago")
- `[characteristic]` - Notable characteristic

## Best Practices

1. **Lead with emoji** - 🚨📈📉🆕
2. **Put numbers first** - "$2.4M" not "A large amount"
3. **Include context** - Past performance matters
4. **Add urgency** - "JUST moved", "FRESH wallet"
5. **Keep it scannable** - Bullet points > paragraphs
6. **Add mystery** - "This whale has a history of..."

## Example Output

```
🚨 WHALE ALERT 🚨

7uy4...Xz9q just moved $2.4M into BONK

• From: Unknown wallet
• To: Staking contract  
• Token: Bonk (BONK)
• Amount: $2,412,750 USD
• Time: 15 minutes ago

This whale has a history of early meme coin entries.
Follow @iseeicode for real-time alerts. #Solana #BONK
```