#!/usr/bin/env python3
"""
Create bar chart of NFL team home vs away win percentages 2004-2024
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2024.csv')

# Calculate home and away win percentages for each team-season
df['home_games'] = df['home_wins'] + df['home_losses'] + df['home_ties']
df['away_games'] = df['away_wins'] + df['away_losses'] + df['away_ties']
df['home_win_pct'] = (df['home_wins'] + 0.5 * df['home_ties']) / df['home_games']
df['away_win_pct'] = (df['away_wins'] + 0.5 * df['away_ties']) / df['away_games']

# Calculate average home and away win % for each team across all seasons
team_avg = df.groupby('team').agg({
    'home_win_pct': 'mean',
    'away_win_pct': 'mean'
}).reset_index()

# Calculate overall win % for sorting
team_avg['overall_win_pct'] = (team_avg['home_win_pct'] + team_avg['away_win_pct']) / 2
team_avg = team_avg.sort_values('overall_win_pct', ascending=False)

# Create grouped bar chart
fig, ax = plt.subplots(figsize=(14, 10))

x = np.arange(len(team_avg))
width = 0.35

bars1 = ax.barh(x - width/2, team_avg['home_win_pct'], width,
                label='Home Win %', color='#2E7D32', edgecolor='black', linewidth=0.5)
bars2 = ax.barh(x + width/2, team_avg['away_win_pct'], width,
                label='Away Win %', color='#1565C0', edgecolor='black', linewidth=0.5)

# Add value labels on bars
for i, row in team_avg.iterrows():
    ax.text(row['home_win_pct'] + 0.01, i - width/2, f"{row['home_win_pct']:.3f}",
            va='center', fontsize=7, fontweight='bold')
    ax.text(row['away_win_pct'] + 0.01, i + width/2, f"{row['away_win_pct']:.3f}",
            va='center', fontsize=7, fontweight='bold')

# Add reference line at .500
ax.axvline(x=0.5, color='red', linestyle='--', linewidth=1.5, alpha=0.7, label='.500')

ax.set_yticks(x)
ax.set_yticklabels(team_avg['team'])
ax.set_xlabel('Win Percentage', fontsize=12, fontweight='bold')
ax.set_ylabel('Team', fontsize=12, fontweight='bold')
ax.set_title('NFL Team Home vs Away Win Percentages (2004-2024 Regular Season)\nAveraged Across Seasons, Ordered by Overall Win %',
             fontsize=13, fontweight='bold', pad=20)
ax.set_xlim(0, 0.8)
ax.grid(axis='x', alpha=0.3, linestyle='--')
ax.legend(loc='lower right', fontsize=10)

plt.tight_layout()
plt.savefig('nfl_team_home_away_win_pct_2004_2024.png', dpi=300, bbox_inches='tight')
print("✓ Chart saved as: nfl_team_home_away_win_pct_2004_2024.png")

# Print summary statistics
print("\n" + "="*70)
print("TOP 10 TEAMS (by overall win %):")
print("="*70)
print(f"{'Team':<6} {'Home %':<8} {'Away %':<8} {'Difference':<12} {'Overall %':<10}")
print("-"*70)
for idx, row in team_avg.head(10).iterrows():
    diff = row['home_win_pct'] - row['away_win_pct']
    print(f"{row['team']:<6} {row['home_win_pct']:.3f}    {row['away_win_pct']:.3f}    {diff:+.3f}        {row['overall_win_pct']:.3f}")

print("\n" + "="*70)
print("BOTTOM 10 TEAMS (by overall win %):")
print("="*70)
print(f"{'Team':<6} {'Home %':<8} {'Away %':<8} {'Difference':<12} {'Overall %':<10}")
print("-"*70)
for idx, row in team_avg.tail(10).iterrows():
    diff = row['home_win_pct'] - row['away_win_pct']
    print(f"{row['team']:<6} {row['home_win_pct']:.3f}    {row['away_win_pct']:.3f}    {diff:+.3f}        {row['overall_win_pct']:.3f}")

print("\n" + "="*70)
print("HOME FIELD ADVANTAGE ANALYSIS:")
print("="*70)
print(f"League avg home win %: {team_avg['home_win_pct'].mean():.3f}")
print(f"League avg away win %: {team_avg['away_win_pct'].mean():.3f}")
print(f"Home field advantage:  {(team_avg['home_win_pct'].mean() - team_avg['away_win_pct'].mean()):.3f}")

# Teams with best/worst home field advantage
team_avg['home_advantage'] = team_avg['home_win_pct'] - team_avg['away_win_pct']
print("\n" + "="*70)
print("TEAMS WITH BEST HOME FIELD ADVANTAGE:")
print("="*70)
best_home = team_avg.nlargest(5, 'home_advantage')
for idx, row in best_home.iterrows():
    print(f"{row['team']:<6} Home: {row['home_win_pct']:.3f}  Away: {row['away_win_pct']:.3f}  Diff: +{row['home_advantage']:.3f}")

print("\n" + "="*70)
print("TEAMS WITH WORST HOME FIELD ADVANTAGE (or best road teams):")
print("="*70)
worst_home = team_avg.nsmallest(5, 'home_advantage')
for idx, row in worst_home.iterrows():
    print(f"{row['team']:<6} Home: {row['home_win_pct']:.3f}  Away: {row['away_win_pct']:.3f}  Diff: {row['home_advantage']:+.3f}")
