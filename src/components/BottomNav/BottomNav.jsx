import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useT } from "../../i18n/I18n";

const HomeIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z" />
  </svg>
);
const HistoryIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 3v6h6" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const AnalyticsIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20H2" />
  </svg>
);
const ProfileIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const PlusIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function NavItem({ label, Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 w-14 py-1 transition-colors"
    >
      <Icon
        className={`transition-colors ${active ? "text-white" : "text-white/40"}`}
        width="20"
        height="20"
      />
      <span
        className={`text-[10px] transition-colors ${
          active ? "text-white" : "text-white/40"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function BottomNav({ onAdd }) {
  const { t } = useT();
  const [active, setActive] = useState("home");
  const addSheet = useDisclosure();

  const pick = (mode) => {
    addSheet.onClose();
    onAdd?.(mode);
  };

  return (
    <>
      <nav className="sticky bottom-0 w-full flex justify-center pb-3 pt-2 pointer-events-none z-20">
        <div className="relative pointer-events-auto flex items-center justify-between gap-1 px-5 py-2 rounded-full bg-[#0f111a]/90 backdrop-blur-md border border-white/10 shadow-2xl">
          <NavItem
            label={t("nav.home")}
            Icon={HomeIcon}
            active={active === "home"}
            onClick={() => setActive("home")}
          />
          <NavItem
            label={t("nav.history")}
            Icon={HistoryIcon}
            active={active === "history"}
            onClick={() => setActive("history")}
          />

          <button
            onClick={addSheet.onOpen}
            aria-label="Add"
            className="w-10 h-10 rounded-full bg-green-electric text-black flex items-center justify-center shadow-lg mx-1 hover:scale-105 transition-transform"
          >
            <PlusIcon width="18" height="18" />
          </button>

          <NavItem
            label={t("nav.analytics")}
            Icon={AnalyticsIcon}
            active={active === "analytics"}
            onClick={() => setActive("analytics")}
          />
          <NavItem
            label={t("nav.profile")}
            Icon={ProfileIcon}
            active={active === "profile"}
            onClick={() => setActive("profile")}
          />
        </div>
      </nav>

      <Modal
        isOpen={addSheet.isOpen}
        onOpenChange={addSheet.onOpenChange}
        placement="center"
        size="sm"
        shouldBlockScroll={false}
      >
        <ModalContent>
          <ModalHeader>{t("nav.whatToAdd")}</ModalHeader>
          <ModalBody className="pb-6 gap-2">
            <Button
              className="w-full bg-green-electric text-black font-semibold"
              size="lg"
              onPress={() => pick("income")}
            >
              {t("add.income")}
            </Button>
            <Button
              className="w-full bg-[#ff6b4a] text-white font-semibold"
              size="lg"
              onPress={() => pick("expense")}
            >
              {t("add.expense")}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BottomNav;
