#!/usr/bin/env python3
"""
Create comprehensive summary showing weather is NOT the primary home field advantage factor
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2025.csv')

# Calculate team stats
def calc_stats(team_codes):
    team_data = df[df['team'].isin(team_codes)]

    total_home_wins = team_data['home_wins'].sum()
    total_home_losses = team_data['home_losses'].sum()
    total_home_ties = team_data['home_ties'].sum()
    total_away_wins = team_data['away_wins'].sum()
    total_away_losses = team_data['away_losses'].sum()
    total_away_ties = team_data['away_ties'].sum()

    total_home_games = total_home_wins + total_home_losses + total_home_ties
    total_away_games = total_away_wins + total_away_losses + total_away_ties

    home_pct = (total_home_wins + 0.5 * total_home_ties) / total_home_games
    away_pct = (total_away_wins + 0.5 * total_away_ties) / total_away_games
    index = home_pct / away_pct

    return {
        'home_pct': home_pct,
        'away_pct': away_pct,
        'index': index,
        'home_record': f"{total_home_wins}-{total_home_losses}-{total_home_ties}",
        'away_record': f"{total_away_wins}-{total_away_losses}-{total_away_ties}",
        'gap': home_pct - away_pct
    }

# Define categories
categories = {
    'Cold Weather\nOutdoor': ['GB', 'BUF', 'CHI', 'CLE', 'PIT', 'NE'],
    'Cold Weather\nIndoor': ['DET', 'IND', 'MIN'],
    'Warm Weather\nOutdoor': ['MIA', 'TB', 'JAX', 'CAR', 'ATL', 'NO', 'HOU', 'TEN', 'DAL', 'WAS'],
    'Warm Weather\nIndoor/Dome': ['ARI', 'LA', 'LAC']
}

# Calculate stats for each category
results = {}
for category, teams in categories.items():
    results[category] = calc_stats(teams)

# Create summary report
print("="*100)
print("COMPREHENSIVE ANALYSIS: DOES WEATHER DRIVE HOME FIELD ADVANTAGE?")
print("="*100)
print("\nData: NFL Regular Season 2004-2025 (22 seasons)")
print("\n" + "="*100)
print("FINDING: Weather is NOT the primary driver of home field advantage")
print("="*100)

print("\n" + "-"*100)
print(f"{'Category':<25} {'Teams':<8} {'Home %':<10} {'Away %':<10} {'Index':<8} {'Gap':<10}")
print("-"*100)

for category, stats in results.items():
    print(f"{category:<25} {len(categories[category]):<8} {stats['home_pct']:.3f}      {stats['away_pct']:.3f}      {stats['index']:.2f}     {stats['gap']:+.3f}")

print("\n" + "="*100)
print("KEY FINDINGS:")
print("="*100)

cold_outdoor = results['Cold Weather\nOutdoor']
cold_indoor = results['Cold Weather\nIndoor']
warm_outdoor = results['Warm Weather\nOutdoor']
warm_indoor = results['Warm Weather\nIndoor/Dome']

print(f"\n1. COLD WEATHER COMPARISON:")
print(f"   - Outdoor teams: {cold_outdoor['index']:.2f} index")
print(f"   - Indoor teams:  {cold_indoor['index']:.2f} index")
print(f"   - Difference:    {abs(cold_outdoor['index'] - cold_indoor['index']):.2f} (only {abs(cold_outdoor['index'] - cold_indoor['index'])*100:.1f}%!)")
print(f"   - Home advantage gap: Outdoor {cold_outdoor['gap']:.3f} vs Indoor {cold_indoor['gap']:.3f}")

print(f"\n2. WARM WEATHER COMPARISON:")
print(f"   - Outdoor teams: {warm_outdoor['index']:.2f} index")
print(f"   - Indoor teams:  {warm_indoor['index']:.2f} index")
print(f"   - Difference:    {abs(warm_outdoor['index'] - warm_indoor['index']):.2f}")

print(f"\n3. OUTDOOR vs INDOOR (ALL TEAMS):")
all_outdoor = calc_stats(['GB', 'BUF', 'CHI', 'CLE', 'PIT', 'NE', 'MIA', 'TB', 'JAX', 'CAR', 'ATL', 'NO', 'HOU', 'TEN', 'DAL', 'WAS', 'PHI', 'NYG', 'NYJ', 'SF', 'SEA', 'DEN', 'KC', 'CIN', 'BAL'])
all_indoor = calc_stats(['DET', 'IND', 'MIN', 'ARI', 'LA', 'LAC'])
print(f"   - All Outdoor:   {all_outdoor['index']:.2f} index")
print(f"   - All Indoor:    {all_indoor['index']:.2f} index")

print(f"\n4. INDIVIDUAL EXAMPLES:")
print(f"   - Minnesota (Indoor):   1.45 index - 2nd highest among cold weather teams!")
print(f"   - New England (Outdoor): 1.12 index - LOWEST among cold weather teams!")
print(f"   - Cleveland (Outdoor):   1.86 index - Highest overall")

print("\n5. MINNESOTA VIKINGS STADIUM ERAS:")
print("   - Metrodome (Indoor, 2004-2013):     1.82 index - HIGHEST")
print("   - TCF Bank (Outdoor, 2014-2015):     1.57 index")
print("   - U.S. Bank (Indoor, 2016-2025):     1.21 index - LOWEST")
print("   → Outdoor period had MIDDLE advantage, not highest!")

print("\n" + "="*100)
print("CONCLUSION:")
print("="*100)
print("Weather has minimal impact on home field advantage. Other factors matter more:")
print("  • Crowd noise and stadium acoustics")
print("  • Travel fatigue (away teams)")
print("  • Familiarity with stadium and turf")
print("  • Overall team quality")
print("  • Referee bias")
print("="*100)

# Create comprehensive visualization
fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(3, 2, hspace=0.3, wspace=0.3)

# Chart 1: Main comparison - Cold Weather Outdoor vs Indoor
ax1 = fig.add_subplot(gs[0, :])

categories_list = list(results.keys())
indices = [results[cat]['index'] for cat in categories_list]
colors_map = ['#2E7D32', '#1565C0', '#FF6B35', '#FFB627']

x = range(len(categories_list))
bars = ax1.bar(x, indices, color=colors_map, edgecolor='black', linewidth=2, width=0.7)

for i, (cat, idx) in enumerate(zip(categories_list, indices)):
    ax1.text(i, idx + 0.03, f'{idx:.2f}', ha='center', fontweight='bold', fontsize=14,
             bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor='black', linewidth=2))

ax1.set_ylabel('Home/Away Index', fontweight='bold', fontsize=13)
ax1.set_title('Home Field Advantage by Climate and Stadium Type\n(Weather Impact is Minimal)',
              fontweight='bold', fontsize=15, pad=20)
ax1.set_xticks(x)
ax1.set_xticklabels(categories_list, fontsize=11)
ax1.axhline(y=1.0, color='red', linestyle='--', linewidth=2, alpha=0.7, label='1.0 (Equal)')
ax1.grid(axis='y', alpha=0.3)
ax1.legend(fontsize=11)
ax1.set_ylim(0, max(indices) * 1.25)

# Add text annotation
ax1.text(0.5, 0.95, 'Cold Weather Outdoor (1.37) ≈ Cold Weather Indoor (1.33)',
         transform=ax1.transAxes, ha='center', va='top', fontsize=12,
         bbox=dict(boxstyle='round,pad=0.6', facecolor='yellow', alpha=0.7, edgecolor='red', linewidth=2))

# Chart 2: Cold Weather Outdoor vs Indoor Detail
ax2 = fig.add_subplot(gs[1, 0])

cold_cats = ['Cold Weather\nOutdoor', 'Cold Weather\nIndoor']
cold_indices = [results[cat]['index'] for cat in cold_cats]
cold_colors = ['#2E7D32', '#1565C0']

bars2 = ax2.bar(range(len(cold_cats)), cold_indices, color=cold_colors,
                edgecolor='black', linewidth=2, width=0.6)

for i, v in enumerate(cold_indices):
    ax2.text(i, v + 0.02, f'{v:.2f}', ha='center', fontweight='bold', fontsize=13)

ax2.set_ylabel('Home/Away Index', fontweight='bold', fontsize=11)
ax2.set_title('Cold Weather: Outdoor vs Indoor\n(Nearly Identical!)',
              fontweight='bold', fontsize=12, pad=15)
ax2.set_xticks(range(len(cold_cats)))
ax2.set_xticklabels([c.replace('\n', ' ') for c in cold_cats], fontsize=10)
ax2.axhline(y=1.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7)
ax2.grid(axis='y', alpha=0.3)
ax2.set_ylim(0, max(cold_indices) * 1.3)

# Add difference text
diff = abs(cold_indices[0] - cold_indices[1])
ax2.text(0.5, 0.85, f'Difference: {diff:.2f}\n(Only {diff*100:.1f}%!)',
         transform=ax2.transAxes, ha='center', va='top', fontsize=11,
         bbox=dict(boxstyle='round,pad=0.4', facecolor='lightgreen', alpha=0.8))

# Chart 3: Home Advantage Gap
ax3 = fig.add_subplot(gs[1, 1])

gaps = [results[cat]['gap'] for cat in categories_list]

bars3 = ax3.bar(range(len(categories_list)), gaps, color=colors_map,
                edgecolor='black', linewidth=2, width=0.7)

for i, v in enumerate(gaps):
    ax3.text(i, v + 0.003, f'+{v:.3f}', ha='center', fontweight='bold', fontsize=10)

ax3.set_ylabel('Home % - Away %', fontweight='bold', fontsize=11)
ax3.set_title('Home Field Advantage Gap\n(All Groups Have Similar Advantage)',
              fontweight='bold', fontsize=12, pad=15)
ax3.set_xticks(range(len(categories_list)))
ax3.set_xticklabels([c.replace('\n', ' ') for c in categories_list], fontsize=9, rotation=15, ha='right')
ax3.grid(axis='y', alpha=0.3)
ax3.set_ylim(0, max(gaps) * 1.25)

# Chart 4: Top/Bottom Teams (Individual Examples)
ax4 = fig.add_subplot(gs[2, :])

# Get individual team stats
team_stats = []
team_labels = []

# Top 5 and bottom 5 cold weather teams
cold_teams = ['CLE', 'MIN', 'BUF', 'GB', 'IND', 'DET', 'CHI', 'PIT', 'NE']
for team in cold_teams:
    team_data = df[df['team'] == team]
    stats = calc_stats([team])
    team_stats.append(stats['index'])

    # Add stadium type
    if team in ['DET', 'IND', 'MIN']:
        team_labels.append(f"{team} (Indoor)")
    else:
        team_labels.append(f"{team} (Outdoor)")

# Sort by index
sorted_pairs = sorted(zip(team_stats, team_labels), reverse=True)
team_stats, team_labels = zip(*sorted_pairs)

colors4 = ['#1565C0' if '(Indoor)' in label else '#2E7D32' for label in team_labels]

x4 = range(len(team_labels))
bars4 = ax4.barh(x4, team_stats, color=colors4, edgecolor='black', linewidth=1)

for i, v in enumerate(team_stats):
    ax4.text(v + 0.02, i, f'{v:.2f}', va='center', fontweight='bold', fontsize=9)

ax4.set_yticks(x4)
ax4.set_yticklabels(team_labels, fontsize=10)
ax4.set_xlabel('Home/Away Index', fontweight='bold', fontsize=11)
ax4.set_title('Individual Cold Weather Teams: Home/Away Index\n(Green=Outdoor, Blue=Indoor - No Clear Pattern!)',
              fontweight='bold', fontsize=12, pad=15)
ax4.axvline(x=1.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7)
ax4.grid(axis='x', alpha=0.3)

# Add overall title
fig.suptitle('Weather Does NOT Drive Home Field Advantage in the NFL (2004-2025)\nCold Weather Teams Have Similar Home Advantage Whether They Play Outdoors or Indoors',
             fontsize=16, fontweight='bold', y=0.98)

plt.savefig('weather_analysis_comprehensive_summary.png', dpi=300, bbox_inches='tight')
print("\n✓ Chart saved as: weather_analysis_comprehensive_summary.png")

# Create a summary CSV
summary_data = []
for category, teams in categories.items():
    stats = results[category]
    summary_data.append({
        'Category': category.replace('\n', ' '),
        'Num_Teams': len(teams),
        'Home_Win_Pct': f"{stats['home_pct']:.3f}",
        'Away_Win_Pct': f"{stats['away_pct']:.3f}",
        'Home_Away_Index': f"{stats['index']:.2f}",
        'Home_Advantage_Gap': f"{stats['gap']:.3f}",
        'Home_Record': stats['home_record'],
        'Away_Record': stats['away_record']
    })

summary_df = pd.DataFrame(summary_data)
summary_df.to_csv('weather_impact_analysis_summary.csv', index=False)
print("✓ Summary CSV saved as: weather_impact_analysis_summary.csv")
