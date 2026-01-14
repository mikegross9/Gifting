#!/usr/bin/env python3
"""
Create summary spreadsheet with team win percentages and home/away index
"""

import pandas as pd

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2025.csv')

# Sum up total wins/losses/ties across all seasons for each team
team_totals = df.groupby('team').agg({
    'home_wins': 'sum',
    'home_losses': 'sum',
    'home_ties': 'sum',
    'away_wins': 'sum',
    'away_losses': 'sum',
    'away_ties': 'sum'
}).reset_index()

# Calculate total home and away games
team_totals['home_games'] = team_totals['home_wins'] + team_totals['home_losses'] + team_totals['home_ties']
team_totals['away_games'] = team_totals['away_wins'] + team_totals['away_losses'] + team_totals['away_ties']

# Calculate overall home and away win percentages
team_totals['home_win_pct'] = (team_totals['home_wins'] + 0.5 * team_totals['home_ties']) / team_totals['home_games']
team_totals['away_win_pct'] = (team_totals['away_wins'] + 0.5 * team_totals['away_ties']) / team_totals['away_games']

# Calculate total wins, losses, ties, games
team_totals['total_wins'] = team_totals['home_wins'] + team_totals['away_wins']
team_totals['total_losses'] = team_totals['home_losses'] + team_totals['away_losses']
team_totals['total_ties'] = team_totals['home_ties'] + team_totals['away_ties']
team_totals['total_games'] = team_totals['total_wins'] + team_totals['total_losses'] + team_totals['total_ties']

# Calculate overall win percentage
team_totals['total_win_pct'] = (team_totals['total_wins'] + 0.5 * team_totals['total_ties']) / team_totals['total_games']

# Calculate the home/away index
team_totals['home_away_index'] = team_totals['home_win_pct'] / team_totals['away_win_pct']

# Create final spreadsheet with selected columns
summary = team_totals[[
    'team',
    'total_win_pct',
    'home_win_pct',
    'away_win_pct',
    'home_away_index',
    'total_wins',
    'total_losses',
    'total_ties',
    'total_games',
    'home_wins',
    'home_losses',
    'home_ties',
    'away_wins',
    'away_losses',
    'away_ties'
]].copy()

# Sort by total win percentage (best to worst)
summary = summary.sort_values('total_win_pct', ascending=False).reset_index(drop=True)

# Save to CSV
output_file = 'nfl_team_summary_2004_2025.csv'
summary.to_csv(output_file, index=False)
print(f"✓ Saved to {output_file}")

# Display the data
print("\n" + "="*120)
print("NFL TEAM SUMMARY (2004-2025)")
print("="*120)
print(f"{'Team':<6} {'Total W%':<10} {'Home W%':<10} {'Away W%':<10} {'Index':<8} {'Record':<15} {'Home':<12} {'Away':<12}")
print("-"*120)
for idx, row in summary.iterrows():
    record = f"{int(row['total_wins'])}-{int(row['total_losses'])}-{int(row['total_ties'])}"
    home_rec = f"{int(row['home_wins'])}-{int(row['home_losses'])}-{int(row['home_ties'])}"
    away_rec = f"{int(row['away_wins'])}-{int(row['away_losses'])}-{int(row['away_ties'])}"
    print(f"{row['team']:<6} {row['total_win_pct']:.3f}      {row['home_win_pct']:.3f}      {row['away_win_pct']:.3f}      {row['home_away_index']:.2f}     {record:<15} {home_rec:<12} {away_rec:<12}")

print("\n" + "="*120)
print(f"Total teams: {len(summary)}")
print(f"Highest total win %: {summary.iloc[0]['team']} ({summary.iloc[0]['total_win_pct']:.3f})")
print(f"Lowest total win %: {summary.iloc[-1]['team']} ({summary.iloc[-1]['total_win_pct']:.3f})")
print(f"Highest home/away index: {summary.nlargest(1, 'home_away_index').iloc[0]['team']} ({summary.nlargest(1, 'home_away_index').iloc[0]['home_away_index']:.2f})")
print(f"Lowest home/away index: {summary.nsmallest(1, 'home_away_index').iloc[0]['team']} ({summary.nsmallest(1, 'home_away_index').iloc[0]['home_away_index']:.2f})")
