#!/usr/bin/env python3
"""
Analyze Oakland/Las Vegas Raiders home/away index by stadium era
"""

import pandas as pd
import matplotlib.pyplot as plt

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2025.csv')

# Filter to Raiders (OAK and LV)
raiders_df = df[(df['team'] == 'OAK') | (df['team'] == 'LV')].copy()

# Define stadium eras
# Oakland Coliseum (outdoor): 2004-2019 (as OAK)
# Allegiant Stadium (indoor dome): 2020-2025 (as LV)

raiders_df['era'] = raiders_df.apply(
    lambda x: 'Oakland Coliseum (Outdoor)' if x['team'] == 'OAK'
    else 'Allegiant Stadium (Indoor)', axis=1
)

# Calculate stats for each era
print("="*80)
print("OAKLAND/LAS VEGAS RAIDERS HOME/AWAY PERFORMANCE BY STADIUM ERA")
print("="*80)

for era in ['Oakland Coliseum (Outdoor)', 'Allegiant Stadium (Indoor)']:
    era_df = raiders_df[raiders_df['era'] == era]

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

# Also analyze Arizona Cardinals (outdoor to indoor in 2006)
print("\n" + "="*80)
print("ARIZONA CARDINALS HOME/AWAY PERFORMANCE BY STADIUM ERA")
print("="*80)

cardinals_df = df[df['team'] == 'ARI'].copy()
cardinals_df['era'] = cardinals_df['season'].apply(
    lambda x: 'Sun Devil Stadium (Outdoor)' if x <= 2005
    else 'State Farm Stadium (Retractable/Indoor)'
)

for era in ['Sun Devil Stadium (Outdoor)', 'State Farm Stadium (Retractable/Indoor)']:
    era_df = cardinals_df[cardinals_df['era'] == era]

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

    print(f"\n{era}")
    print(f"  Seasons: {era_df['season'].min()}-{era_df['season'].max()} ({len(era_df)} seasons)")
    print(f"  Home Record: {total_home_wins}-{total_home_losses}-{total_home_ties} ({home_win_pct:.3f})")
    print(f"  Away Record: {total_away_wins}-{total_away_losses}-{total_away_ties} ({away_win_pct:.3f})")
    print(f"  Home/Away Index: {index:.2f}")
    print(f"  Difference: {home_win_pct - away_win_pct:+.3f}")

# Create visualization for Raiders
print("\n" + "="*80)
print("RAIDERS YEAR-BY-YEAR BREAKDOWN")
print("="*80)
print(f"{'Season':<8} {'Team':<6} {'Stadium':<30} {'Home':<12} {'Away':<12} {'Index':<8}")
print("-"*80)

for _, row in raiders_df.sort_values('season').iterrows():
    home_rec = f"{row['home_wins']}-{row['home_losses']}-{row['home_ties']}"
    away_rec = f"{row['away_wins']}-{row['away_losses']}-{row['away_ties']}"

    home_games = row['home_wins'] + row['home_losses'] + row['home_ties']
    away_games = row['away_wins'] + row['away_losses'] + row['away_ties']

    home_pct = (row['home_wins'] + 0.5 * row['home_ties']) / home_games
    away_pct = (row['away_wins'] + 0.5 * row['away_ties']) / away_games

    index = home_pct / away_pct if away_pct > 0 else 0

    print(f"{row['season']:<8} {row['team']:<6} {row['era']:<30} {home_rec:<12} {away_rec:<12} {index:.2f}")

# Create comparison chart
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Raiders comparison
raiders_stats = []
for era in ['Oakland Coliseum (Outdoor)', 'Allegiant Stadium (Indoor)']:
    era_df = raiders_df[raiders_df['era'] == era]
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

    raiders_stats.append({
        'era': era.replace(' (Outdoor)', '\n(Outdoor)').replace(' (Indoor)', '\n(Indoor)'),
        'home_pct': home_win_pct,
        'away_pct': away_win_pct,
        'index': index
    })

raiders_stats_df = pd.DataFrame(raiders_stats)

# Chart 1: Raiders Index
x = range(len(raiders_stats_df))
colors = ['#000000', '#A5ACAF']  # Black for outdoor, Silver for indoor
ax1.bar(x, raiders_stats_df['index'], color=colors, edgecolor='white', linewidth=2)

for i, v in enumerate(raiders_stats_df['index']):
    ax1.text(i, v + 0.05, f'{v:.2f}', ha='center', fontweight='bold', fontsize=12, color='white',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='black', alpha=0.7))

ax1.set_ylabel('Home/Away Index', fontweight='bold', fontsize=12)
ax1.set_title('Raiders: Home/Away Index by Stadium Era\n(16 seasons outdoor vs 6 seasons indoor)',
              fontweight='bold', fontsize=12, pad=15)
ax1.set_xticks(x)
ax1.set_xticklabels(raiders_stats_df['era'], fontsize=9)
ax1.axhline(y=1.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7, label='1.0 (Equal)')
ax1.grid(axis='y', alpha=0.3)
ax1.legend()
ax1.set_ylim(0, max(raiders_stats_df['index']) * 1.3)

# Cardinals comparison
cardinals_stats = []
for era in ['Sun Devil Stadium (Outdoor)', 'State Farm Stadium (Retractable/Indoor)']:
    era_df = cardinals_df[cardinals_df['era'] == era]
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

    cardinals_stats.append({
        'era': era.replace('Sun Devil Stadium (Outdoor)', 'Sun Devil\n(Outdoor)').replace('State Farm Stadium (Retractable/Indoor)', 'State Farm\n(Indoor)'),
        'home_pct': home_win_pct,
        'away_pct': away_win_pct,
        'index': index
    })

cardinals_stats_df = pd.DataFrame(cardinals_stats)

# Chart 2: Cardinals Index
x2 = range(len(cardinals_stats_df))
colors2 = ['#97233F', '#FFB612']  # Cardinal red for outdoor, Gold for indoor
ax2.bar(x2, cardinals_stats_df['index'], color=colors2, edgecolor='black', linewidth=2)

for i, v in enumerate(cardinals_stats_df['index']):
    ax2.text(i, v + 0.05, f'{v:.2f}', ha='center', fontweight='bold', fontsize=12, color='white',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='black', alpha=0.7))

ax2.set_ylabel('Home/Away Index', fontweight='bold', fontsize=12)
ax2.set_title('Cardinals: Home/Away Index by Stadium Era\n(2 seasons outdoor vs 20 seasons indoor)',
              fontweight='bold', fontsize=12, pad=15)
ax2.set_xticks(x2)
ax2.set_xticklabels(cardinals_stats_df['era'], fontsize=9)
ax2.axhline(y=1.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7, label='1.0 (Equal)')
ax2.grid(axis='y', alpha=0.3)
ax2.legend()
ax2.set_ylim(0, max(cardinals_stats_df['index']) * 1.3)

plt.tight_layout()
plt.savefig('raiders_cardinals_stadium_comparison.png', dpi=300, bbox_inches='tight')
print("\n✓ Chart saved as: raiders_cardinals_stadium_comparison.png")
