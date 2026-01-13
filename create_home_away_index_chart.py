#!/usr/bin/env python3
"""
Create bar chart of NFL team home/away win percentage index 2004-2024
Index = (Home Win %) / (Away Win %) per season, then averaged across seasons
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2024.csv')

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

# Calculate the home/away index
team_totals['home_away_index'] = team_totals['home_win_pct'] / team_totals['away_win_pct']

# Rename for consistency with rest of code
team_index = team_totals[['team', 'home_away_index', 'home_win_pct', 'away_win_pct']].copy()

# Sort by index
team_index = team_index.sort_values('home_away_index', ascending=False)

# Create bar chart
fig, ax = plt.subplots(figsize=(12, 10))

# Color coding: index > 1.5 = strong home advantage, < 1.0 = better away, 1.0-1.5 = normal
colors = ['#C62828' if idx >= 1.5 else '#1565C0' if idx < 1.0 else '#2E7D32' if idx >= 1.3 else '#FFB627'
          for idx in team_index['home_away_index']]

bars = ax.barh(team_index['team'], team_index['home_away_index'], color=colors,
                edgecolor='black', linewidth=0.5)

# Add value labels on bars
for i, (idx, row) in enumerate(team_index.iterrows()):
    ax.text(row['home_away_index'] + 0.03, i, f"{row['home_away_index']:.2f}",
             va='center', fontsize=8, fontweight='bold')

# Add reference line at 1.0 (equal home/away performance)
ax.axvline(x=1.0, color='red', linestyle='--', linewidth=2, alpha=0.7, label='1.0 (Equal)')

ax.set_xlabel('Home/Away Win % Index', fontsize=12, fontweight='bold')
ax.set_ylabel('Team', fontsize=12, fontweight='bold')
ax.set_title('NFL Team Home/Away Win % Index (2004-2024)\nIndex = (Home Win %) / (Away Win %) averaged across seasons\nHigher = Stronger Home Field Advantage',
          fontsize=13, fontweight='bold', pad=20)
ax.set_xlim(0, 2.5)
ax.grid(axis='x', alpha=0.3, linestyle='--')
ax.legend(loc='lower right', fontsize=10)
fig.tight_layout()

# Save the chart
plt.savefig('nfl_team_home_away_index_2004_2024.png', dpi=300, bbox_inches='tight')
print("✓ Chart saved as: nfl_team_home_away_index_2004_2024.png")

# Print summary statistics
print("\n" + "="*75)
print("TOP 10 TEAMS - STRONGEST HOME FIELD ADVANTAGE (Highest Index):")
print("="*75)
print(f"{'Team':<6} {'Index':<8} {'Home %':<8} {'Away %':<8} {'Interpretation':<30}")
print("-"*75)
for idx, row in team_index.head(10).iterrows():
    interp = "Strong home advantage" if row['home_away_index'] >= 1.5 else "Moderate home advantage"
    print(f"{row['team']:<6} {row['home_away_index']:.2f}     {row['home_win_pct']:.3f}    {row['away_win_pct']:.3f}    {interp}")

print("\n" + "="*75)
print("BOTTOM 10 TEAMS - WEAKEST HOME FIELD ADVANTAGE (Lowest Index):")
print("="*75)
print(f"{'Team':<6} {'Index':<8} {'Home %':<8} {'Away %':<8} {'Interpretation':<30}")
print("-"*75)
for idx, row in team_index.tail(10).iterrows():
    if row['home_away_index'] < 1.0:
        interp = "Better on road!"
    elif row['home_away_index'] < 1.1:
        interp = "Minimal home advantage"
    else:
        interp = "Weak home advantage"
    print(f"{row['team']:<6} {row['home_away_index']:.2f}     {row['home_win_pct']:.3f}    {row['away_win_pct']:.3f}    {interp}")

print("\n" + "="*75)
print("OVERALL STATISTICS:")
print("="*75)
print(f"League average index:        {team_index['home_away_index'].mean():.2f}")
print(f"Median index:                {team_index['home_away_index'].median():.2f}")
print(f"Highest index:               {team_index['home_away_index'].max():.2f} ({team_index.iloc[0]['team']})")
print(f"Lowest index:                {team_index['home_away_index'].min():.2f} ({team_index.iloc[-1]['team']})")
print(f"\nTeams with index >= 1.5:     {len(team_index[team_index['home_away_index'] >= 1.5])}")
print(f"Teams with index < 1.0:      {len(team_index[team_index['home_away_index'] < 1.0])}")
print(f"Teams with 1.0 <= index < 1.5: {len(team_index[(team_index['home_away_index'] >= 1.0) & (team_index['home_away_index'] < 1.5)])}")
