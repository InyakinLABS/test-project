"use client";

import "./player_card_styles.scss";
import { PlayerAccount, MMRData } from "@/types/responses";
import Image from "next/image";
import { PlayerRank } from "./PlayerRank";

interface PlayerCardProps {
  account: PlayerAccount;
  mmr?: MMRData;
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
          <p className="player-card__region">{account.region.toUpperCase()}</p>
        </div>
      </div>

      <PlayerRank mmr={mmr} />
    </div>
  );
}
