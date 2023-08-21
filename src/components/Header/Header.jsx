import React from "react";
import { NotificationIcon } from "../NotificationIcon/NotificationIcon";
import { Avatar, Badge, Button } from "@nextui-org/react";

function Header() {
  return (
    <div className="w-full flex">
      <div className="w-2/4 flex gap-4 items-center">
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          size="md"
        />
        <p className="text-[#A2F263]">
          Your name <span>&#62;</span>{" "}
        </p>
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
