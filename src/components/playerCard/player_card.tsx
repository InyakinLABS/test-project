// components/player/player_card.tsx
"use client";
import "./player_card_styles.scss";
import { PlayerAccount } from "@/types/responses";
import Image from "next/image";

interface PlayerCardProps {
  account: PlayerAccount;
  mmr?: {
    current_data: {
      currenttierpatched: string;
      elo: number;
    };
    highest_rank: {
      patched_tier: string;
    };
  };
}

export function PlayerCard({ account, mmr }: PlayerCardProps) {
  return (
    <div className="player-card">
      <div className="player-card__header">
        <Image
          width={56}
          height={56}
          src={account.card.small}
          alt={account.name}
          className="player-card__avatar"
        />
        <div className="player-card__info">
          <h1 className="player-card__name">
            {account.name}
            <span className="player-card__tag">#{account.tag}</span>
          </h1>
          <p className="player-card__level">Уровень {account.account_level}</p>
          <p className="player-card__region">{account.region}</p>
        </div>
      </div>

      {mmr && mmr.current_data && (
        <div className="player-card__rank">
          <div className="player-card__rank-item">
            <span className="player-card__rank-label">Текущий ранг</span>
            <span className="player-card__rank-value">
              {mmr.current_data.currenttierpatched || "Unranked"}
            </span>
            <span className="player-card__rank-elo">
              {mmr.current_data.elo || 0} эло
            </span>
          </div>
          {mmr.highest_rank && (
            <div className="player-card__rank-item">
              <span className="player-card__rank-label">Пик</span>
              <span className="player-card__rank-value">
                {mmr.highest_rank.patched_tier || "Unknown"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
