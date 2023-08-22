import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

function AddTransaction({
  transactionName,
  transactionAmount,
  handleTransactionName,
  handleTransactionAmount,
  increaseBalance,
  decreaseBalance,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button onPress={onOpen}>Add Transaction</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div>
                  <Input
                    type="text"
                    label="Name"
                    placeholder="Transaction name"
                    onChange={handleTransactionName}
                    value={transactionName}
                    labelPlacement="outside"
                  />
                  <Input
                    type="number"
                    label="Amount"
                    placeholder="0.00"
                    labelPlacement="outside"
                    onChange={handleTransactionAmount}
                    value={transactionAmount}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }
                  />
                  <div className="flex flex-col my-2">
                    <label className="text-sm">Category</label>
                    <select className="w-full rounded-xl p-2 bg-[#3f3f466c]">
                      <option className="bg-[#3f3f465a]">Shopping</option>
                      <option className="bg-[#3f3f465a]">Food</option>
                      <option className="bg-[#3f3f465a]">Other</option>
                    </select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={decreaseBalance}
                  onPress={onClose}
                >
                  Expense
                </Button>
                <Button
                  color="success"
                  onClick={increaseBalance}
                  onPress={onClose}
                >
                  Income
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTransaction;
