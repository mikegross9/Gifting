#!/usr/bin/env python3
"""
Analyze Minnesota Vikings home/away index by stadium era
"""

import pandas as pd
import matplotlib.pyplot as plt

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2025.csv')

# Filter to Minnesota only
min_df = df[df['team'] == 'MIN'].copy()

# Define stadium eras
# Metrodome (indoor): 1982-2013
# TCF Bank Stadium (outdoor, temporary): 2014-2015
# U.S. Bank Stadium (indoor): 2016-present

min_df['era'] = min_df['season'].apply(
    lambda x: 'Metrodome (Indoor)' if x <= 2013
    else 'TCF Bank (Outdoor)' if x <= 2015
    else 'U.S. Bank (Indoor)'
)

# Calculate stats for each era
print("="*80)
print("MINNESOTA VIKINGS HOME/AWAY PERFORMANCE BY STADIUM ERA")
print("="*80)

for era in ['Metrodome (Indoor)', 'TCF Bank (Outdoor)', 'U.S. Bank (Indoor)']:
    era_df = min_df[min_df['era'] == era]

    if len(era_df) == 0:
        continue

    # Calculate totals
    total_home_wins = era_df['home_wins'].sum()
    total_home_losses = era_df['home_losses'].sum()
    total_home_ties = era_df['home_ties'].sum()
    total_away_wins = era_df['away_wins'].sum()
    total_away_losses = era_df['away_losses'].sum()
    total_away_ties = era_df['away_ties'].sum()

    total_home_games = total_home_wins + total_home_losses + total_home_ties
    total_away_games = total_away_wins + total_away_losses + total_away_ties

    home_win_pct = (total_home_wins + 0.5 * total_home_ties) / total_home_games
    away_win_pct = (total_away_wins + 0.5 * total_away_ties) / total_away_games

    index = home_win_pct / away_win_pct if away_win_pct > 0 else 0

    print(f"\n{era}")
    print(f"  Seasons: {era_df['season'].min()}-{era_df['season'].max()} ({len(era_df)} seasons)")
    print(f"  Home Record: {total_home_wins}-{total_home_losses}-{total_home_ties} ({home_win_pct:.3f})")
    print(f"  Away Record: {total_away_wins}-{total_away_losses}-{total_away_ties} ({away_win_pct:.3f})")
    print(f"  Home/Away Index: {index:.2f}")
    print(f"  Difference: {home_win_pct - away_win_pct:+.3f}")

# Create visualization
print("\n" + "="*80)
print("YEAR-BY-YEAR BREAKDOWN")
print("="*80)
print(f"{'Season':<8} {'Stadium':<22} {'Home':<12} {'Away':<12} {'Home %':<8} {'Away %':<8} {'Index':<8}")
print("-"*80)

for _, row in min_df.sort_values('season').iterrows():
    home_rec = f"{row['home_wins']}-{row['home_losses']}-{row['home_ties']}"
    away_rec = f"{row['away_wins']}-{row['away_losses']}-{row['away_ties']}"

    home_games = row['home_wins'] + row['home_losses'] + row['home_ties']
    away_games = row['away_wins'] + row['away_losses'] + row['away_ties']

    home_pct = (row['home_wins'] + 0.5 * row['home_ties']) / home_games
    away_pct = (row['away_wins'] + 0.5 * row['away_ties']) / away_games

    index = home_pct / away_pct if away_pct > 0 else 0

    print(f"{row['season']:<8} {row['era']:<22} {home_rec:<12} {away_rec:<12} {home_pct:.3f}    {away_pct:.3f}    {index:.2f}")

# Create bar chart comparing eras
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Group data by era
era_stats = []
for era in ['Metrodome (Indoor)', 'TCF Bank (Outdoor)', 'U.S. Bank (Indoor)']:
    era_df = min_df[min_df['era'] == era]
    if len(era_df) == 0:
        continue

    total_home_wins = era_df['home_wins'].sum()
    total_home_losses = era_df['home_losses'].sum()
    total_home_ties = era_df['home_ties'].sum()
    total_away_wins = era_df['away_wins'].sum()
    total_away_losses = era_df['away_losses'].sum()
    total_away_ties = era_df['away_ties'].sum()

    total_home_games = total_home_wins + total_home_losses + total_home_ties
    total_away_games = total_away_wins + total_away_losses + total_away_ties

    home_win_pct = (total_home_wins + 0.5 * total_home_ties) / total_home_games
    away_win_pct = (total_away_wins + 0.5 * total_away_ties) / total_away_games
    index = home_win_pct / away_win_pct if away_win_pct > 0 else 0

    era_stats.append({
        'era': era,
        'home_pct': home_win_pct,
        'away_pct': away_win_pct,
        'index': index
    })

era_df = pd.DataFrame(era_stats)

# Chart 1: Home vs Away Win %
x = range(len(era_df))
width = 0.35

ax1.bar([i - width/2 for i in x], era_df['home_pct'], width, label='Home Win %', color='#4C1D95')
ax1.bar([i + width/2 for i in x], era_df['away_pct'], width, label='Away Win %', color='#FFC62F')

ax1.set_ylabel('Win Percentage', fontweight='bold')
ax1.set_title('Minnesota Vikings: Home vs Away Win % by Stadium Era', fontweight='bold', pad=20)
ax1.set_xticks(x)
ax1.set_xticklabels([e.replace(' (Indoor)', '\n(Indoor)').replace(' (Outdoor)', '\n(Outdoor)') for e in era_df['era']], fontsize=9)
ax1.legend()
ax1.grid(axis='y', alpha=0.3)
ax1.axhline(y=0.5, color='red', linestyle='--', linewidth=1, alpha=0.5)

# Chart 2: Home/Away Index
colors = ['#4C1D95', '#059669', '#4C1D95']  # Indoor = purple, Outdoor = green
ax2.bar(x, era_df['index'], color=colors, edgecolor='black', linewidth=1)

for i, v in enumerate(era_df['index']):
    ax2.text(i, v + 0.05, f'{v:.2f}', ha='center', fontweight='bold', fontsize=11)

ax2.set_ylabel('Home/Away Index', fontweight='bold')
ax2.set_title('Minnesota Vikings: Home/Away Index by Stadium Era', fontweight='bold', pad=20)
ax2.set_xticks(x)
ax2.set_xticklabels([e.replace(' (Indoor)', '\n(Indoor)').replace(' (Outdoor)', '\n(Outdoor)') for e in era_df['era']], fontsize=9)
ax2.axhline(y=1.0, color='red', linestyle='--', linewidth=1, alpha=0.5, label='1.0 (Equal)')
ax2.grid(axis='y', alpha=0.3)
ax2.legend()
ax2.set_ylim(0, max(era_df['index']) * 1.2)

plt.tight_layout()
plt.savefig('vikings_stadium_era_comparison.png', dpi=300, bbox_inches='tight')
print("\n✓ Chart saved as: vikings_stadium_era_comparison.png")
