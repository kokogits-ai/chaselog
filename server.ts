import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsed requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default values as fallback and seeding matching the requested profile
const DEFAULT_USER_DATA = {
  surname: "Cox",
  middleName: "Michelle",
  lastName: "Ann",
  fullName: "Michelle Ann Cox", // Combined standard representation
  username: "Michelle1959",
  password: "Myhappyplace$55",
  email: "mac92559@gmail.com",
  pin: "1959",
  dob: "09/25/1959",
  phone: "2017245887",
  country: "USA",
  state: "Pennsylvania",
  city: "Pittsburgh",
  zip: "15218",
  address: "1300 MILTON AVE",
  occupation: "retired",
  gender: "Female",
  accountNum: "175920396482",
  routing: "482081877",
  availableBalance: 426990,
  savingsBalance: 426990,
  checkingBalance: 67000,
  creditLimit: 50000,
  billingMessage: "Initial balance synchronized securely."
};

const DEFAULT_TRANSACTIONS = [
  { id: 1, name: "Transfer - 175920396482", amount: -150000.07, status: "Pending", date: "May 15, 2026", category: "Transfer", icon: "send", routing: "281081877", isPending: true },
  { id: 2, name: "Amazon Marketplace", amount: -128.50, status: "Completed", date: "May 18, 2026", category: "Shopping", icon: "shopping", isPending: false },
  { id: 3, name: "Salary Deposit - Contractor", amount: 12500.00, status: "Completed", date: "May 15, 2026", category: "Income", icon: "income", isPending: false },
  { id: 4, name: "Shell Gasoline", amount: -65.20, status: "Completed", date: "May 14, 2026", category: "Transport", icon: "transport", isPending: false },
  { id: 5, name: "Whole Foods Market", amount: -212.45, status: "Completed", date: "May 12, 2026", category: "Groceries", icon: "groceries", isPending: false },
  { id: 6, name: "Netflix Subscription", amount: -19.99, status: "Completed", date: "May 10, 2026", category: "Entertainment", icon: "entertainment", isPending: false },
  { id: 7, name: "Interest Credit", amount: 45.30, status: "Completed", date: "May 01, 2026", category: "Rewards", icon: "rewards", isPending: false }
];

// Lazy in-memory state fallback if database_url is not connected
let memoryUserProfile = { ...DEFAULT_USER_DATA };
let memoryTransactions = [ ...DEFAULT_TRANSACTIONS ];

let pool: pg.Pool | null = null;
let dbInitialized = false;

// Safe Lazy database pool initialization
function getPool() {
  if (pool) return pool;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required securely for standard Neon/RDS configuration
  });
  return pool;
}

// Self-healing lazy initialization for PostgreSQL schemas and tables
async function initializeDb() {
  if (dbInitialized) return true;
  const p = getPool();
  if (!p) return false;

  try {
    const client = await p.connect();
    try {
      // 1. Setup chase_profile table
      await client.query(`
        CREATE TABLE IF NOT EXISTS chase_profile (
          id SERIAL PRIMARY KEY,
          surname VARCHAR(100),
          middle_name VARCHAR(100),
          last_name VARCHAR(100),
          full_name VARCHAR(200),
          username VARCHAR(100) UNIQUE,
          password VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          pin VARCHAR(10),
          dob VARCHAR(50),
          phone VARCHAR(50),
          country VARCHAR(100),
          state VARCHAR(100),
          city VARCHAR(100),
          zip VARCHAR(20),
          address VARCHAR(300),
          occupation VARCHAR(200),
          gender VARCHAR(50),
          account_num VARCHAR(100),
          routing VARCHAR(100),
          available_balance NUMERIC,
          savings_balance NUMERIC,
          checking_balance NUMERIC,
          credit_limit NUMERIC,
          billing_message VARCHAR(1000)
        )
      `);

      // 2. Setup chase_transactions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS chase_transactions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(300),
          amount NUMERIC,
          status VARCHAR(100),
          date VARCHAR(100),
          category VARCHAR(100),
          icon VARCHAR(100),
          routing VARCHAR(100),
          is_pending BOOLEAN
        )
      `);

      // 3. Seed active profile if missing
      const profileRes = await client.query('SELECT COUNT(*) FROM chase_profile');
      if (parseInt(profileRes.rows[0].count, 10) === 0) {
        await client.query(`
          INSERT INTO chase_profile (
            surname, middle_name, last_name, full_name, username, password, email, pin,
            dob, phone, country, state, city, zip, address, occupation, gender,
            account_num, routing, available_balance, savings_balance, checking_balance,
            credit_limit, billing_message
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `, [
          DEFAULT_USER_DATA.surname, DEFAULT_USER_DATA.middleName, DEFAULT_USER_DATA.lastName, DEFAULT_USER_DATA.fullName,
          DEFAULT_USER_DATA.username, DEFAULT_USER_DATA.password, DEFAULT_USER_DATA.email, DEFAULT_USER_DATA.pin,
          DEFAULT_USER_DATA.dob, DEFAULT_USER_DATA.phone, DEFAULT_USER_DATA.country, DEFAULT_USER_DATA.state,
          DEFAULT_USER_DATA.city, DEFAULT_USER_DATA.zip, DEFAULT_USER_DATA.address, DEFAULT_USER_DATA.occupation,
          DEFAULT_USER_DATA.gender, DEFAULT_USER_DATA.accountNum, DEFAULT_USER_DATA.routing,
          DEFAULT_USER_DATA.availableBalance, DEFAULT_USER_DATA.savingsBalance, DEFAULT_USER_DATA.checkingBalance,
          DEFAULT_USER_DATA.creditLimit, DEFAULT_USER_DATA.billingMessage
        ]);
        console.log("Database initialized: seeded default secure profile successfully.");
      }

      // 4. Seed fallback default transactions if database is freshly deployed
      const txRes = await client.query('SELECT COUNT(*) FROM chase_transactions');
      if (parseInt(txRes.rows[0].count, 10) === 0) {
        for (const tx of DEFAULT_TRANSACTIONS) {
          await client.query(`
            INSERT INTO chase_transactions (name, amount, status, date, category, icon, routing, is_pending)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [tx.name, tx.amount, tx.status, tx.date, tx.category, tx.icon, tx.routing || '', tx.isPending]);
        }
        console.log("Database initialized: seeded demo transactions history securely.");
      }

      dbInitialized = true;
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("Neon Database failed loading or not accessible. Continuing peacefully in memory mode.", err);
    return false;
  }
}

// Transform columns from snake_case database schema back into camelCase React structure
function mapProfileToCamel(row: any) {
  return {
    surname: row.surname,
    middleName: row.middle_name,
    lastName: row.last_name,
    fullName: row.full_name,
    username: row.username,
    password: row.password,
    email: row.email,
    pin: row.pin,
    dob: row.dob,
    phone: row.phone,
    country: row.country,
    state: row.state,
    city: row.city,
    zip: row.zip,
    address: row.address,
    occupation: row.occupation,
    gender: row.gender,
    accountNum: row.account_num,
    routing: row.routing,
    availableBalance: parseFloat(row.available_balance),
    savingsBalance: parseFloat(row.savings_balance),
    checkingBalance: parseFloat(row.checking_balance),
    creditLimit: parseFloat(row.credit_limit),
    billingMessage: row.billing_message
  };
}

// Transform database transaction back to frontend format
function mapTx(row: any) {
  return {
    id: row.id,
    name: row.name,
    amount: parseFloat(row.amount),
    status: row.status,
    date: row.date,
    category: row.category,
    icon: row.icon,
    routing: row.routing,
    isPending: row.is_pending
  };
}


// --- API ROUTE ENDPOINTS ---

// 1. GET User Profile
app.get('/api/profile', async (req, res) => {
  const isDbReady = await initializeDb();
  if (isDbReady) {
    const p = getPool();
    if (p) {
      try {
        const result = await p.query('SELECT * FROM chase_profile ORDER BY id ASC LIMIT 1');
        if (result.rows.length > 0) {
          return res.json(mapProfileToCamel(result.rows[0]));
        }
      } catch (err) {
        console.error("Error querying profile from database:", err);
      }
    }
  }
  // Fallback to Server MemState
  res.json(memoryUserProfile);
});

// 2. PUT User Profile Update
app.put('/api/profile', async (req, res) => {
  const updatedData = req.body;
  const isDbReady = await initializeDb();

  // Merge default values over inputs so we don't clear necessary tags
  const updated = {
    surname: updatedData.surname ?? DEFAULT_USER_DATA.surname,
    middleName: updatedData.middleName ?? DEFAULT_USER_DATA.middleName,
    lastName: updatedData.lastName ?? DEFAULT_USER_DATA.lastName,
    fullName: updatedData.fullName ?? `${updatedData.surname ?? DEFAULT_USER_DATA.surname} ${updatedData.middleName ?? DEFAULT_USER_DATA.middleName} ${updatedData.lastName ?? DEFAULT_USER_DATA.lastName}`,
    username: updatedData.username ?? DEFAULT_USER_DATA.username,
    password: updatedData.password ?? DEFAULT_USER_DATA.password,
    email: updatedData.email ?? DEFAULT_USER_DATA.email,
    pin: updatedData.pin ?? DEFAULT_USER_DATA.pin,
    dob: updatedData.dob ?? DEFAULT_USER_DATA.dob,
    phone: updatedData.phone ?? DEFAULT_USER_DATA.phone,
    country: updatedData.country ?? DEFAULT_USER_DATA.country,
    state: updatedData.state ?? DEFAULT_USER_DATA.state,
    city: updatedData.city ?? DEFAULT_USER_DATA.city,
    zip: updatedData.zip ?? DEFAULT_USER_DATA.zip,
    address: updatedData.address ?? DEFAULT_USER_DATA.address,
    occupation: updatedData.occupation ?? DEFAULT_USER_DATA.occupation,
    gender: updatedData.gender ?? DEFAULT_USER_DATA.gender,
    accountNum: updatedData.accountNum ?? DEFAULT_USER_DATA.accountNum,
    routing: updatedData.routing ?? DEFAULT_USER_DATA.routing,
    availableBalance: parseFloat(updatedData.availableBalance ?? DEFAULT_USER_DATA.availableBalance),
    savingsBalance: parseFloat(updatedData.savingsBalance ?? DEFAULT_USER_DATA.savingsBalance),
    checkingBalance: parseFloat(updatedData.checkingBalance ?? DEFAULT_USER_DATA.checkingBalance),
    creditLimit: parseFloat(updatedData.creditLimit ?? DEFAULT_USER_DATA.creditLimit),
    billingMessage: updatedData.billingMessage ?? DEFAULT_USER_DATA.billingMessage
  };

  if (isDbReady) {
    const p = getPool();
    if (p) {
      try {
        await p.query(`
          UPDATE chase_profile
          SET surname = $1, middle_name = $2, last_name = $3, full_name = $4, username = $5,
              password = $6, email = $7, pin = $8, dob = $9, phone = $10, country = $11,
              state = $12, city = $13, zip = $14, address = $15, occupation = $16,
              gender = $17, account_num = $18, routing = $19, available_balance = $20,
              savings_balance = $21, checking_balance = $22, credit_limit = $23, billing_message = $24
          WHERE id = (SELECT id FROM chase_profile ORDER BY id ASC LIMIT 1)
        `, [
          updated.surname, updated.middleName, updated.lastName, updated.fullName, updated.username,
          updated.password, updated.email, updated.pin, updated.dob, updated.phone, updated.country,
          updated.state, updated.city, updated.zip, updated.address, updated.occupation,
          updated.gender, updated.accountNum, updated.routing, updated.availableBalance,
          updated.savingsBalance, updated.checkingBalance, updated.creditLimit, updated.billingMessage
        ]);
        return res.json(updated);
      } catch (err) {
        console.error("Error updating database profile:", err);
      }
    }
  }

  // Fallback to memory
  memoryUserProfile = { ...updated };
  res.json(memoryUserProfile);
});

// 3. GET Transactions history List
app.get('/api/transactions', async (req, res) => {
  const isDbReady = await initializeDb();
  if (isDbReady) {
    const p = getPool();
    if (p) {
      try {
        const result = await p.query('SELECT * FROM chase_transactions ORDER BY id DESC');
        return res.json(result.rows.map(mapTx));
      } catch (err) {
        console.error("Error retrieving ledger from database:", err);
      }
    }
  }
  // Fallback to memory
  res.json(memoryTransactions);
});

// 4. POST Create Transaction (Transfers, checking out, etc.)
app.post('/api/transactions', async (req, res) => {
  const txData = req.body;
  
  const tx = {
    name: txData.name ?? 'Transfer transaction',
    amount: parseFloat(txData.amount ?? 0),
    status: txData.status ?? 'Pending',
    date: txData.date ?? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    category: txData.category ?? 'Transfer',
    icon: txData.icon ?? 'send',
    routing: txData.routing ?? '482081877',
    isPending: txData.isPending ?? true
  };

  const isDbReady = await initializeDb();
  if (isDbReady) {
    const p = getPool();
    if (p) {
      try {
        // Insert transaction into Postgres database
        const txResult = await p.query(`
          INSERT INTO chase_transactions (name, amount, status, date, category, icon, routing, is_pending)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `, [tx.name, tx.amount, tx.status, tx.date, tx.category, tx.icon, tx.routing, tx.isPending]);

        return res.json(mapTx(txResult.rows[0]));
      } catch (err) {
        console.error("Error record transaction in postgres database:", err);
      }
    }
  }

  // Fallback connection mode: Pushes newly made transactions onto memory state
  const mockId = memoryTransactions.length > 0 ? Math.max(...memoryTransactions.map(t => t.id ?? 0)) + 1 : 1;
  const newTxInMem = { ...tx, id: mockId };
  memoryTransactions.unshift(newTxInMem);

  res.json(newTxInMem);
});


// --- VITE MIDDLEWARE SETUP & STATIC SERVING IN PRODUCTION ---

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serves compiled frontend static bundles
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chase App Server listening with routing ingress on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Error initializing primary App Server:", error);
});
