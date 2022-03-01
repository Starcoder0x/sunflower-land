import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import bank from "assets/buildings/bank.gif";
import token from "assets/icons/token.gif";

import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { canSync } from "features/game/lib/whitelist";
import { metamask } from "lib/blockchain/metamask";
import { Panel } from "components/ui/Panel";
import { BankModal } from "./components/BankModal";
import bankMp3 from "../../assets/sound-effects/bank.mp3";

export const Bank: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showComingSoon, setShowComingSoon] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const bankAudio = new Audio(bankMp3);
  bankAudio.volume = 0.3;

  const open = () => {
    if (!canSync(metamask.myAccount as string)) {
      setShowComingSoon(true);
      return;
    }
    bankAudio.play();
    setIsOpen(true);
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 2.5}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -5}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 11.5}px)`,
      }}
    >
      <img
        src={bank}
        alt="bank"
        onClick={isNotReadOnly ? open : undefined}
        className={classNames("w-full", {
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      />
      {isNotReadOnly && (
        <Action
          className="absolute -bottom-6 left-3 "
          text="Bank"
          icon={token}
          onClick={open}
        />
      )}
      <Modal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        centered
        dialogClassName="w-full sm:w-2/3 max-w-6xl"
      >
        <BankModal onClose={() => setIsOpen(false)} />
      </Modal>

      {/* TODO - To be deleted when withdraw and "Sync on chain" are implemented */}
      <Modal
        show={showComingSoon}
        onHide={() => setShowComingSoon(false)}
        centered
      >
        <Panel>Coming soon!</Panel>
      </Modal>
    </div>
  );
};
