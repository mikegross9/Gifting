#!/usr/bin/env python3
"""
Pull NFL team-season home/away W-L-T splits for 2004-2024 regular season.
Uses nflfastR public data.
"""

import pandas as pd
import requests
import sys
from io import StringIO

def main():
    print("Fetching NFL data from nflfastR...")

    try:
        # Load the games data from raw GitHub
        url = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        df = pd.read_csv(StringIO(response.text), low_memory=False)
        print(f"Loaded {len(df)} games")

        # Filter to regular season only and seasons 2004-2024
        df = df[(df['season'] >= 2004) & (df['season'] <= 2024) & (df['game_type'] == 'REG')]
        print(f"Filtered to {len(df)} regular season games (2004-2024)")

        # Initialize results dictionary
        results = {}

        # Process each game
        for _, game in df.iterrows():
            season = game['season']
            home_team = game['home_team']
            away_team = game['away_team']
            home_score = game['home_score']
            away_score = game['away_score']

            # Skip games with missing scores
            if pd.isna(home_score) or pd.isna(away_score):
                continue

            # Initialize team-season records if not exists
            for team in [home_team, away_team]:
                key = (season, team)
                if key not in results:
                    results[key] = {
                        'season': season,
                        'team': team,
                        'home_wins': 0,
                        'home_losses': 0,
                        'home_ties': 0,
                        'away_wins': 0,
                        'away_losses': 0,
                        'away_ties': 0
                    }

            home_key = (season, home_team)
            away_key = (season, away_team)

            # Determine outcome and update records
            if home_score > away_score:
                # Home team wins
                results[home_key]['home_wins'] += 1
                results[away_key]['away_losses'] += 1
            elif away_score > home_score:
                # Away team wins
                results[away_key]['away_wins'] += 1
                results[home_key]['home_losses'] += 1
            else:
                # Tie
                results[home_key]['home_ties'] += 1
                results[away_key]['away_ties'] += 1

        # Convert to DataFrame
        output_df = pd.DataFrame(list(results.values()))
        output_df = output_df.sort_values(['season', 'team']).reset_index(drop=True)

        # Save to CSV
        output_file = 'nfl_team_season_home_away_2004_2024.csv'
        output_df.to_csv(output_file, index=False)
        print(f"\n✓ Saved to {output_file}")

        # Display first 20 rows
        print(f"\nFirst 20 rows:")
        print(output_df.head(20).to_string(index=False))

        # Sanity checks
        print("\n" + "="*60)
        print("SANITY CHECKS:")
        print("="*60)

        total_home_wins = output_df['home_wins'].sum()
        total_home_losses = output_df['home_losses'].sum()
        total_home_ties = output_df['home_ties'].sum()
        total_away_wins = output_df['away_wins'].sum()
        total_away_losses = output_df['away_losses'].sum()
        total_away_ties = output_df['away_ties'].sum()

        print(f"Total home wins:    {total_home_wins}")
        print(f"Total away losses:  {total_away_losses}")
        print(f"✓ Home wins == Away losses: {total_home_wins == total_away_losses}")
        print()
        print(f"Total away wins:    {total_away_wins}")
        print(f"Total home losses:  {total_home_losses}")
        print(f"✓ Away wins == Home losses: {total_away_wins == total_home_losses}")
        print()
        print(f"Total home ties:    {total_home_ties}")
        print(f"Total away ties:    {total_away_ties}")
        print(f"✓ Home ties == Away ties: {total_home_ties == total_away_ties}")
        print()
        print(f"Total rows (team-seasons): {len(output_df)}")
        print(f"Total seasons: {output_df['season'].nunique()}")
        print(f"Total teams: {output_df['team'].nunique()}")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
