const sql = require('mssql');

async function fixPatterns() {
  const config = {
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    options: { encrypt: true, trustServerCertificate: false }
  };

  const pool = await sql.connect(config);
  
  // Check all categories
  const all = await pool.request().query('SELECT id, name, regexPatterns FROM transactionCategories');
  console.log('All categories in database:');
  all.recordset.forEach(cat => {
    console.log(`  ${cat.id}: ${cat.name} - patterns: ${cat.regexPatterns ? 'EXISTS' : 'NULL'}`);
  });
  
  // Define patterns that should exist
  const patterns = {
    'Salary': ['salary', 'wage', 'payroll', 'income'],
    'Groceries': ['supermarket', 'grocery', 'food', 'checkers', 'woolworths', 'pick n pay', 'shoprite'],
    'Fuel': ['petrol', 'diesel', 'fuel', 'engen', 'shell', 'bp', 'caltex'],
    'Entertainment': ['restaurant', 'movie', 'entertainment', 'netflix', 'dstv'],
    'Bills': ['bill', 'municipal', 'eskom', 'electricity', 'water'],
    'Investment': ['investment', 'dividend', 'interest', 'capital gain'],
    'Transfer': ['transfer', 'payment', 'pay'],
    'ATM Withdrawal': ['atm', 'withdrawal', 'cash'],
    'Insurance': ['insurance', 'king price', 'magtape debit king price'],
    'Other': []
  };
  
  for (const [name, patternsArray] of Object.entries(patterns)) {
    const category = all.recordset.find(c => c.name === name);
    if (category && !category.regexPatterns) {
      await pool.request()
        .input('id', sql.Int, category.id)
        .input('patterns', sql.NVarChar, JSON.stringify(patternsArray))
        .query('UPDATE transactionCategories SET regexPatterns = @patterns WHERE id = @id');
      console.log(`✅ Updated ${name} with ${patternsArray.length} patterns`);
    }
  }
  
  await pool.close();
  console.log('\n✅ Pattern update complete');
}

fixPatterns().catch(console.error);
