import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

function TransactionList({ transactionHistory, handleDelete }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="w-full h-80 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Transactions</h2>
        <Button onPress={onOpen} className="bg-transparent border-1 h-5/6">
          View More
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior={"inside"}
        >
          <ModalContent>
            {
              <>
                <ModalBody>
                  <div className="py-2 px-2">
                    {transactionHistory.length > 0 ? (
                      transactionHistory.map((transaction) => (
                        <Dropdown key={transaction.id}>
                          <DropdownTrigger>
                            <div className="flex justify-around mb-1 bg-[#3E3E3E] px-2 rounded-2xl">
                              <div className="mb-2 mt-2 w-2/4 overflow-hidden">
                                <p className="font-semibold text-lg text-white">
                                  {transaction.name}
                                </p>
                                <p className="text-sm text-[#6C6C6C]">
                                  {transaction.date}
                                </p>
                              </div>
                              <div className="flex items-center w-2/4 justify-end overflow-hidden">
                                <p className="font-semibold text-lg text-white">
                                  <span>
                                    {transaction.type === "income" ? "+" : "-"}
                                  </span>
                                  ${transaction.amount}
                                </p>
                              </div>
                            </div>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Static Actions">
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              onClick={() =>
                                handleDelete(transaction, transactionHistory)
                              }
                            >
                              Delete file
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      ))
                    ) : (
                      <div className="text-center">
                        <h1>you don't have any transactions.</h1>
                      </div>
                    )}
                  </div>
                </ModalBody>
              </>
            }
          </ModalContent>
        </Modal>
      </div>

      <div className="w-full">
        {transactionHistory.length > 0 ? (
          transactionHistory.slice(0, 4).map((transaction) => (
            <Dropdown key={transaction.id}>
              <DropdownTrigger>
                <div className="flex justify-around mb-1 bg-[#3E3E3E] px-2 rounded-2xl">
                  <div className="mb-2 mt-2 w-2/4 overflow-hidden">
                    <p className="font-semibold text-lg text-white">
                      {transaction.name}
                    </p>
                    <p className="text-sm text-[#6C6C6C]">{transaction.date}</p>
                  </div>
                  <div className="flex items-center ml-2 w-2/4 justify-end overflow-hidden">
                    <p className="font-semibold text-lg text-white">
                      <span>{transaction.type === "income" ? "+" : "-"}</span>$
                      {transaction.amount}
                    </p>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => handleDelete(transaction, transactionHistory)}
                >
                  Delete file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default TransactionList;
