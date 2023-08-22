import { React, useState } from "react";
import { NotificationIcon } from "../NotificationIcon/NotificationIcon";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";

function Header() {
  let nameLocalStorage = localStorage.getItem('name');
  const [name, setName] = useState(nameLocalStorage == null ? 'Enter your name' : nameLocalStorage);
  const [input, setInput] = useState('')
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleInput = e =>{
    setInput(e.target.value)
  }
  const handleName = () =>{
    setName(input)
    localStorage.setItem("name", input);
    setInput('')
  }

  return (
    <div className="w-full flex">
      <div className="w-2/4 flex gap-4 items-center">
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          size="md"
        />
        <Button className="bg-transparent text-[#A2F263]" onPress={onOpen}>
          {name}
          <span className="text-[#6C6C6C]">&#62;</span>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <Input
                    type="text"
                    label="Name"
                    placeholder="Enter your name"
                    onChange={handleInput}
                    value={input}
                    labelPlacement="outside"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="success" onPress={onClose} onClick={handleName}>
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <div className="w-3/6 flex justify-end items-center">
        <Badge>
          <Button
            isDot="true"
            radius="full"
            isIconOnly
            aria-label="Notifications"
            variant="light"
          >
            <NotificationIcon size={24} />
          </Button>
        </Badge>
      </div>
    </div>
  );
}

export default Header;
