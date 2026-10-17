import { createContext, useContext, useEffect, useState } from "react";

const translations = {
  en: {
    "greeting.morning": "Good Morning!",
    "greeting.afternoon": "Good Afternoon!",
    "greeting.evening": "Good Evening!",
    "common.confirm": "Confirm",
    "common.add": "Add",
    "common.delete": "Delete",
    "common.name": "Name",
    "common.amount": "Amount",
    "common.date": "Date",
    "common.optional": "optional",
    "common.none": "None yet.",
    "header.enterName": "Enter your name",
    "header.defaultName": "Jordan Wells",
    "card.balance": "Card Balance",
    "cards.expenses": "Expenses",
    "cards.totalSpent": "Total spent",
    "cards.income": "Income",
    "cards.totalIncome": "Total income",
    "transactions.title": "Transactions",
    "transactions.all": "All Transactions",
    "transactions.empty": "No transactions yet.",
    "transactions.emptyLong": "You don't have any transactions.",
    "add.income": "Add Income",
    "add.expense": "Add Expense",
    "add.transactionName": "Transaction name",
    "add.category": "Category",
    "add.selectCategory": "Select a category",
    "add.createCategory": "+ Create a category",
    "add.payment": "Payment method",
    "add.selectPayment": "Select a payment method",
    "add.createPayment": "+ Create a payment method",
    "add.source": "Source",
    "add.selectSource": "Select a source",
    "add.createSource": "+ Create an income source",
    "add.installments": "Installments",
    "add.account": "Account",
    "add.selectAccount": "Select an account",
    "add.createAccount": "+ Create your first account",
    "add.alertName": "The transaction name cannot be empty.",
    "add.alertAmount": "The transaction amount cannot be empty.",
    "add.alertAccount": "Please select an account.",
    "picker.category": "Select category",
    "picker.payment": "Select payment method",
    "picker.source": "Select source",
    "picker.account": "Select account",
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.tabAccounts": "Accounts",
    "settings.tabCategories": "Categories",
    "settings.tabPayments": "Payment Methods",
    "settings.tabIncome": "Income Sources",
    "settings.newAccount": "New account name",
    "settings.newCategory": "New category name",
    "settings.newPayment": "New payment method",
    "settings.newSource": "New income source",
    "settings.credit": "Credit card (enables installments)",
    "settings.creditChip": "CREDIT",
    "nav.home": "Home",
    "nav.history": "History",
    "nav.analytics": "Analytics",
    "nav.profile": "Profile",
    "nav.whatToAdd": "What do you want to add?",
  },
  es: {
    "greeting.morning": "¡Buenos días!",
    "greeting.afternoon": "¡Buenas tardes!",
    "greeting.evening": "¡Buenas noches!",
    "common.confirm": "Confirmar",
    "common.add": "Agregar",
    "common.delete": "Eliminar",
    "common.name": "Nombre",
    "common.amount": "Monto",
    "common.date": "Fecha",
    "common.optional": "opcional",
    "common.none": "Ninguno todavía.",
    "header.enterName": "Ingresá tu nombre",
    "header.defaultName": "Jordan Wells",
    "card.balance": "Saldo",
    "cards.expenses": "Gastos",
    "cards.totalSpent": "Total gastado",
    "cards.income": "Ingresos",
    "cards.totalIncome": "Total ingresos",
    "transactions.title": "Transacciones",
    "transactions.all": "Todas las transacciones",
    "transactions.empty": "Todavía no hay transacciones.",
    "transactions.emptyLong": "No tenés transacciones.",
    "add.income": "Agregar ingreso",
    "add.expense": "Agregar gasto",
    "add.transactionName": "Nombre de la transacción",
    "add.category": "Categoría",
    "add.selectCategory": "Elegí una categoría",
    "add.createCategory": "+ Crear una categoría",
    "add.payment": "Medio de pago",
    "add.selectPayment": "Elegí un medio de pago",
    "add.createPayment": "+ Crear un medio de pago",
    "add.source": "Origen",
    "add.selectSource": "Elegí un origen",
    "add.createSource": "+ Crear un origen de ingreso",
    "add.installments": "Cuotas",
    "add.account": "Cuenta",
    "add.selectAccount": "Elegí una cuenta",
    "add.createAccount": "+ Crear tu primera cuenta",
    "add.alertName": "El nombre de la transacción no puede estar vacío.",
    "add.alertAmount": "El monto de la transacción no puede estar vacío.",
    "add.alertAccount": "Elegí una cuenta.",
    "picker.category": "Elegir categoría",
    "picker.payment": "Elegir medio de pago",
    "picker.source": "Elegir origen",
    "picker.account": "Elegir cuenta",
    "settings.title": "Configuración",
    "settings.language": "Idioma",
    "settings.tabAccounts": "Cuentas",
    "settings.tabCategories": "Categorías",
    "settings.tabPayments": "Medios de pago",
    "settings.tabIncome": "Orígenes de ingreso",
    "settings.newAccount": "Nombre de la cuenta",
    "settings.newCategory": "Nueva categoría",
    "settings.newPayment": "Nuevo medio de pago",
    "settings.newSource": "Nuevo origen",
    "settings.credit": "Tarjeta de crédito (habilita cuotas)",
    "settings.creditChip": "CRÉDITO",
    "nav.home": "Inicio",
    "nav.history": "Historial",
    "nav.analytics": "Análisis",
    "nav.profile": "Perfil",
    "nav.whatToAdd": "¿Qué querés agregar?",
  },
};

const I18nContext = createContext({
  lang: "en",
  setLanguage: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "es") setLang(saved);
  }, []);

  const setLanguage = (next) => {
    setLang(next);
    localStorage.setItem("language", next);
  };

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
