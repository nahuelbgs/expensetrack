import { useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useT } from "../../i18n/I18n";

function Header({ openSettings }) {
  const { t } = useT();
  const nameLocalStorage = localStorage.getItem("name");
  const [name, setName] = useState(nameLocalStorage || t("header.defaultName"));
  const [input, setInput] = useState("");
  const nameModal = useDisclosure();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("greeting.morning");
    if (h < 19) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  const handleName = () => {
    const next = input.trim();
    if (next.length === 0) return;
    setName(next);
    localStorage.setItem("name", next);
    setInput("");
  };

  return (
    <div className="w-full flex items-center justify-between pt-2">
      <div className="flex flex-col">
        <p className="text-2xl font-semibold text-white tracking-tight">
          {greeting()}
        </p>
        <button
          onClick={nameModal.onOpen}
          className="text-sm text-white/50 text-left hover:text-white/80 transition-colors"
        >
          {name}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => openSettings("categories")}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white/70"
          aria-label="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button onClick={nameModal.onOpen} className="shrink-0">
          <Avatar
            showFallback
            src="https://images.unsplash.com/broken"
            size="md"
            className="ring-2 ring-white/10"
          />
        </button>
      </div>

      <Modal
        isOpen={nameModal.isOpen}
        onOpenChange={nameModal.onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="pt-6">
                <Input
                  type="text"
                  label={t("common.name")}
                  placeholder={t("header.enterName")}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  labelPlacement="outside"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-white text-black font-medium"
                  onPress={() => {
                    handleName();
                    onClose();
                  }}
                >
                  {t("common.confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Header;
