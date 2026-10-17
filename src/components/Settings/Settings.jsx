import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Button,
  Input,
  Tabs,
  Tab,
  Checkbox,
} from "@heroui/react";
import { useT } from "../../i18n/I18n";
import { GRADIENT_KEYS, resolveGradient } from "../../accountGradients";

function Section({
  items,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  showCreditToggle = false,
  showGradientPicker = false,
}) {
  const { t } = useT();
  const [name, setName] = useState("");
  const [isCredit, setIsCredit] = useState(false);
  const [gradient, setGradient] = useState(GRADIENT_KEYS[0]);
  const [editingId, setEditingId] = useState(null);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const payload = { name: trimmed };
    if (showCreditToggle) payload.isCredit = isCredit;
    if (showGradientPicker) payload.gradient = gradient;
    onAdd(payload);
    setName("");
    setIsCredit(false);
    setGradient(GRADIENT_KEYS[0]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            size="sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={placeholder}
          />
          <Button
            size="sm"
            className="bg-green-electric text-black font-semibold"
            onPress={submit}
          >
            {t("common.add")}
          </Button>
        </div>
        {showCreditToggle && (
          <Checkbox
            size="sm"
            isSelected={isCredit}
            onValueChange={setIsCredit}
          >
            {t("settings.credit")}
          </Checkbox>
        )}
        {showGradientPicker && (
          <div className="flex flex-wrap gap-2 pt-1">
            {GRADIENT_KEYS.map((key) => {
              const isSelected = key === gradient;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGradient(key)}
                  aria-label={`Color ${key}`}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ background: resolveGradient(key) }}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-default-400 py-3 text-center">
            {t("common.none")}
          </p>
        ) : (
          items.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className="flex flex-col bg-default-100 rounded-lg"
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {showGradientPicker && onUpdate ? (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(isEditing ? null : item.id)
                        }
                        aria-label="Change color"
                        className={`w-4 h-4 rounded-full shrink-0 transition-transform ${
                          isEditing
                            ? "ring-2 ring-white scale-110"
                            : "hover:scale-110"
                        }`}
                        style={{ background: resolveGradient(item.gradient) }}
                      />
                    ) : (
                      showGradientPicker && (
                        <span
                          className="w-4 h-4 rounded-full shrink-0"
                          style={{ background: resolveGradient(item.gradient) }}
                        />
                      )
                    )}
                    <span className="text-sm truncate">{item.name}</span>
                    {item.isCredit && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500 shrink-0">
                        {t("settings.creditChip")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-danger text-xs hover:underline shrink-0"
                  >
                    {t("common.delete")}
                  </button>
                </div>
                {isEditing && showGradientPicker && onUpdate && (
                  <div className="flex flex-wrap gap-2 px-3 pb-3">
                    {GRADIENT_KEYS.map((key) => {
                      const isSelected = key === item.gradient;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            onUpdate(item.id, { gradient: key });
                            setEditingId(null);
                          }}
                          aria-label={`Color ${key}`}
                          className={`w-7 h-7 rounded-full transition-transform ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-offset-default-100 ring-white scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ background: resolveGradient(key) }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Settings({
  isOpen,
  onOpenChange,
  initialTab = "accounts",
  accounts,
  categories,
  paymentMethods,
  incomeSources,
  addAccount,
  removeAccount,
  updateAccount,
  addCategory,
  removeCategory,
  addPaymentMethod,
  removePaymentMethod,
  addIncomeSource,
  removeIncomeSource,
}) {
  const { t, lang, setLanguage } = useT();

  const langButton = (code, label) => (
    <button
      onClick={() => setLanguage(code)}
      className={`px-3 h-7 rounded-full text-xs font-semibold transition-colors ${
        lang === code
          ? "bg-green-electric text-black"
          : "bg-default-100 hover:bg-default-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <ModalHeader>{t("settings.title")}</ModalHeader>
        <ModalBody className="pb-6 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("settings.language")}</span>
            <div className="flex gap-1">
              {langButton("en", "EN")}
              {langButton("es", "ES")}
            </div>
          </div>

          <Tabs
            key={isOpen ? initialTab : "closed"}
            fullWidth
            aria-label="Settings tabs"
            defaultSelectedKey={initialTab}
          >
            <Tab key="accounts" title={t("settings.tabAccounts")}>
              <Section
                items={accounts}
                onAdd={addAccount}
                onRemove={removeAccount}
                onUpdate={updateAccount}
                placeholder={t("settings.newAccount")}
                showGradientPicker
              />
            </Tab>
            <Tab key="categories" title={t("settings.tabCategories")}>
              <Section
                items={categories}
                onAdd={addCategory}
                onRemove={removeCategory}
                placeholder={t("settings.newCategory")}
              />
            </Tab>
            <Tab key="payment" title={t("settings.tabPayments")}>
              <Section
                items={paymentMethods}
                onAdd={addPaymentMethod}
                onRemove={removePaymentMethod}
                placeholder={t("settings.newPayment")}
                showCreditToggle
              />
            </Tab>
            <Tab key="income" title={t("settings.tabIncome")}>
              <Section
                items={incomeSources}
                onAdd={addIncomeSource}
                onRemove={removeIncomeSource}
                placeholder={t("settings.newSource")}
              />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default Settings;
