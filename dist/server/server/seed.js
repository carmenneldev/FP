"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const db_1 = require("./db");
const schema_1 = require("../shared/schema");
async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    try {
        // Seed provinces (South African provinces)
        console.log('Seeding provinces...');
        await db_1.db.insert(schema_1.provinces).values([
            { provinceName: 'Eastern Cape', code: 'EC', country: 'South Africa' },
            { provinceName: 'Free State', code: 'FS', country: 'South Africa' },
            { provinceName: 'Gauteng', code: 'GP', country: 'South Africa' },
            { provinceName: 'KwaZulu-Natal', code: 'KZN', country: 'South Africa' },
            { provinceName: 'Limpopo', code: 'LP', country: 'South Africa' },
            { provinceName: 'Mpumalanga', code: 'MP', country: 'South Africa' },
            { provinceName: 'Northern Cape', code: 'NC', country: 'South Africa' },
            { provinceName: 'North West', code: 'NW', country: 'South Africa' },
            { provinceName: 'Western Cape', code: 'WC', country: 'South Africa' }
        ]).onConflictDoNothing();
        // Seed marital statuses
        console.log('Seeding marital statuses...');
        await db_1.db.insert(schema_1.maritalStatuses).values([
            { statusName: 'Single' },
            { statusName: 'Married' },
            { statusName: 'Divorced' },
            { statusName: 'Widowed' },
            { statusName: 'Separated' },
            { statusName: 'In a Relationship' }
        ]).onConflictDoNothing();
        // Seed preferred languages (South African official languages)
        console.log('Seeding preferred languages...');
        await db_1.db.insert(schema_1.preferredLanguages).values([
            { languageName: 'English' },
            { languageName: 'Afrikaans' },
            { languageName: 'isiZulu' },
            { languageName: 'isiXhosa' },
            { languageName: 'Sepedi' },
            { languageName: 'Setswana' },
            { languageName: 'Sesotho' },
            { languageName: 'Xitsonga' },
            { languageName: 'siSwati' },
            { languageName: 'Tshivenda' },
            { languageName: 'isiNdebele' }
        ]).onConflictDoNothing();
        // Seed policy types
        console.log('Seeding policy types...');
        await db_1.db.insert(schema_1.policyTypes).values([
            { typeName: 'Life Insurance', description: 'Life insurance coverage' },
            { typeName: 'Medical Aid', description: 'Medical insurance coverage' },
            { typeName: 'Short-term Insurance', description: 'Car, home, and asset insurance' },
            { typeName: 'Retirement Annuity', description: 'Retirement savings and annuity products' },
            { typeName: 'Investment Policy', description: 'Investment and savings policies' },
            { typeName: 'Disability Cover', description: 'Disability insurance coverage' },
            { typeName: 'Dread Disease', description: 'Critical illness coverage' }
        ]).onConflictDoNothing();
        // Seed qualifications
        console.log('Seeding qualifications...');
        await db_1.db.insert(schema_1.qualifications).values([
            { qualificationName: 'Higher Certificate in Financial Planning', description: 'Entry-level financial planning qualification' },
            { qualificationName: 'Advanced Certificate in Financial Planning', description: 'Advanced financial planning qualification' },
            { qualificationName: 'Postgraduate Diploma in Financial Planning', description: 'Postgraduate level financial planning' },
            { qualificationName: 'CFP® Certification', description: 'Certified Financial Planner designation' },
            { qualificationName: 'FPI Membership', description: 'Financial Planning Institute membership' },
            { qualificationName: 'FAIS Regulatory Exams', description: 'Financial Advisory and Intermediary Services regulatory compliance' }
        ]).onConflictDoNothing();
        console.log('✅ Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}
// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
        console.log('🎉 Seeding finished');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });
}
