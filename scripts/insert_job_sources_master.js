import mysql from "mysql2/promise";

async function insertJobSourcesMaster() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  const sql = `
    INSERT INTO job_sources
    (source_code, name, base_url, source_type, category, check_frequency, priority)
    VALUES

    /* ===== CENTRAL EXAMS ===== */
    ('SRC_UPSC','Union Public Service Commission','https://upsc.gov.in','central','exam','daily','high'),
    ('SRC_SSC','Staff Selection Commission','https://ssc.gov.in','central','exam','daily','high'),
    ('SRC_RRB','Railway Recruitment Boards','https://www.rrbcdg.gov.in','central','exam','daily','high'),
    ('SRC_RAILWAY_BOARD','Railway Board - Railway Recruitment Cell','https://rrbapply.gov.in','central','exam','daily','high'),
    ('SRC_NTA','National Testing Agency','https://nta.ac.in','central','exam','daily','high'),
    ('SRC_ESIC','Employees State Insurance Corporation','https://esic.gov.in','central','exam','weekly','medium'),
    ('SRC_FCI','Food Corporation of India','https://fci.gov.in','central','exam','weekly','medium'),
    ('SRC_SEBI','Securities and Exchange Board of India','https://sebi.gov.in','central','exam','weekly','medium'),
    ('SRC_CAG','Comptroller and Auditor General','https://cag.gov.in','central','exam','weekly','medium'),
    ('SRC_EPFO','Employees Provident Fund Org','https://www.epfindia.gov.in','central','exam','weekly','high'),

    /* ===== BANKING ===== */
    ('SRC_IBPS','Institute of Banking Personnel Selection','https://www.ibps.in','banking','banking','daily','high'),
    ('SRC_SBI','State Bank of India Careers','https://sbi.co.in/web/careers','banking','banking','daily','high'),
    ('SRC_RBI','Reserve Bank of India','https://www.rbi.org.in','banking','banking','weekly','medium'),
    ('SRC_NABARD','NABARD','https://www.nabard.org','banking','banking','weekly','medium'),

    /* ===== INSURANCE ===== */
    ('SRC_LIC','Life Insurance Corporation of India','https://licindia.in','central','insurance','weekly','medium'),
    ('SRC_NIACL','New India Assurance','https://newindia.co.in','central','insurance','weekly','medium'),
    ('SRC_UIIC','United India Insurance','https://uiic.co.in','central','insurance','weekly','medium'),
    ('SRC_AIC','Agriculture Insurance Company','https://www.aicofindia.com','central','insurance','weekly','low'),

    /* ===== DEFENCE - ARMED FORCES ===== */
    ('SRC_ARMY','Indian Army','https://joinindianarmy.nic.in','defence','defence','daily','high'),
    ('SRC_NAVY','Indian Navy','https://www.joinindiannavy.gov.in','defence','defence','daily','high'),
    ('SRC_AIRFORCE','Indian Air Force','https://indianairforce.nic.in','defence','defence','daily','high'),
    ('SRC_COASTGUARD','Indian Coast Guard','https://joinindiancoastguard.cdac.in','defence','defence','weekly','medium'),

    /* ===== DEFENCE - PARAMILITARY & INTELLIGENCE ===== */
    ('SRC_CISF','Central Industrial Security Force','https://cisf.gov.in','defence','defence','weekly','medium'),
    ('SRC_BSF','Border Security Force','https://bsf.gov.in','defence','defence','weekly','medium'),
    ('SRC_CRPF','Central Reserve Police Force','https://crpf.gov.in','defence','defence','weekly','medium'),
    ('SRC_ITBP','Indo-Tibetan Border Police','https://itbpolice.nic.in','defence','defence','weekly','medium'),
    ('SRC_SSB','Sashastra Seema Bal','https://ssb.gov.in','defence','defence','weekly','medium'),
    ('SRC_IB','Intelligence Bureau','https://www.mha.gov.in','central','defence','weekly','medium'),
    ('SRC_CBI','Central Bureau of Investigation','https://cbi.gov.in','central','defence','weekly','medium'),
    ('SRC_NIA','National Investigation Agency','https://www.nia.gov.in','central','defence','monthly','low'),

    /* ===== PSU - ENERGY ===== */
    ('SRC_ONGC','ONGC','https://ongcindia.com','central','psu','weekly','medium'),
    ('SRC_NTPC','NTPC','https://ntpc.co.in','central','psu','weekly','medium'),
    ('SRC_BHEL','BHEL','https://careers.bhel.in','central','psu','weekly','medium'),
    ('SRC_IOCL','Indian Oil Corporation','https://iocl.com','central','psu','weekly','medium'),
    ('SRC_COAL','Coal India Limited','https://coalindia.in','central','psu','weekly','medium'),
    ('SRC_GAIL','GAIL India Limited','https://gailonline.com','central','psu','weekly','medium'),
    ('SRC_PGCIL','Power Grid Corporation','https://powergrid.in','central','psu','weekly','medium'),
    ('SRC_NHPC','NHPC Limited','https://nhpcindia.com','central','psu','weekly','low'),
    ('SRC_NPCIL','Nuclear Power Corporation of India','https://npcil.nic.in','central','psu','weekly','low'),


    /* ===== PSU - MANUFACTURING & DEFENCE ===== */
    ('SRC_HAL','Hindustan Aeronautics Limited','https://hal-india.co.in','central','psu','weekly','medium'),
    ('SRC_BEL','Bharat Electronics Limited','https://bel-india.in','central','psu','weekly','medium'),
    ('SRC_SAIL','Steel Authority of India','https://sail.co.in','central','psu','weekly','medium'),

    /* ===== PSU - INFRASTRUCTURE & TRANSPORT ===== */
    ('SRC_AAI','Airports Authority of India','https://aai.aero','central','psu','weekly','medium'),
    ('SRC_NHAI','National Highways Authority of India','https://nhai.gov.in','central','psu','weekly','low'),
    ('SRC_DMRC','Delhi Metro Rail Corporation','https://delhimetrorail.com','central','psu','weekly','medium'),
    ('SRC_IRCTC','IRCTC','https://irctc.co.in','central','psu','weekly','low'),

    /* ===== PSU - OTHERS ===== */
    ('SRC_NFL','National Fertilizers Limited','https://nationalfertilizers.com','central','psu','weekly','low'),
    ('SRC_BSNL','BSNL','https://www.bsnl.co.in','central','psu','weekly','medium'),
    ('SRC_MTNL','MTNL','https://www.mtnl.in','central','psu','weekly','low'),

    /* ===== RESEARCH & SCIENCE ===== */
    ('SRC_DRDO','DRDO','https://www.drdo.gov.in','central','research','weekly','medium'),
    ('SRC_ISRO','ISRO','https://www.isro.gov.in','central','research','weekly','medium'),
    ('SRC_CSIR','CSIR','https://www.csir.res.in','central','research','weekly','medium'),
    ('SRC_ICMR','ICMR','https://www.icmr.gov.in','central','research','weekly','low'),
    ('SRC_DAE','Department of Atomic Energy','https://dae.gov.in','central','research','weekly','medium'),
    ('SRC_BARC','Bhabha Atomic Research Centre','https://barc.gov.in','central','research','weekly','medium'),
    ('SRC_ICAR','Indian Council of Agricultural Research','https://icar.org.in','central','research','weekly','low'),

    /* ===== COURTS & JUDICIAL ===== */
    ('SRC_SUPREME_COURT','Supreme Court of India','https://main.sci.gov.in','central','court','weekly','medium'),
    ('SRC_HIGH_COURT','High Courts of India','https://ecourts.gov.in','central','court','weekly','medium'),
    ('SRC_UPSC_JUDICIAL','UPSC - Judicial Services','https://upsc.gov.in','central','court','weekly','medium'),
    ('SRC_CLAT','Common Law Admission Test','https://consortiumofnlus.ac.in','central','education','yearly','low'),

    /* ===== EDUCATION ===== */
    ('SRC_KVS','Kendriya Vidyalaya Sangathan','https://kvsangathan.nic.in','central','education','weekly','medium'),
    ('SRC_NVS','Navodaya Vidyalaya Samiti','https://navodaya.gov.in','central','education','weekly','medium'),
    ('SRC_UGC','University Grants Commission','https://www.ugc.ac.in','central','education','weekly','low'),

    /* ===== HEALTHCARE & MEDICAL ===== */
    ('SRC_AIIMS','All India Institute of Medical Sciences','https://aiimsexams.ac.in','central','health','weekly','medium'),
    ('SRC_PGIMER','PGIMER Chandigarh','https://pgimer.edu.in','central','health','weekly','low'),
    ('SRC_JIPMER','JIPMER','https://jipmer.edu.in','central','health','weekly','low'),

    /* ===== COMPLETING INSURANCE ===== */
    ('SRC_NICL','National Insurance Company','https://nationalinsurance.nic.co.in','central','insurance','weekly','medium'),
    ('SRC_OICL','Oriental Insurance Company','https://orientalinsurance.org.in','central','insurance','weekly','medium'),

    /* ===== POSTAL ===== */
    ('SRC_INDIA_POST','India Post - Postal Recruitment','https://www.indiapost.gov.in','central','exam','weekly','medium'),

    /* ===== MADHYA PRADESH ===== */
    ('SRC_MPPSC','MP Public Service Commission','https://mppsc.mp.gov.in','state','exam','daily','high'),
    ('SRC_MPESB','MP Employees Selection Board','https://esb.mp.gov.in','state','exam','daily','high'),
    ('SRC_MP_POLICE','MP Police Recruitment','https://www.mppolice.gov.in','state','police','weekly','medium'),
    ('SRC_MP_HEALTH','MP Health Department','https://health.mp.gov.in','state','health','weekly','medium'),
    ('SRC_MP_EDU','MP School Education Dept','https://educationportal.mp.gov.in','state','education','weekly','medium')

    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      base_url = VALUES(base_url),
      source_type = VALUES(source_type),
      category = VALUES(category),
      check_frequency = VALUES(check_frequency),
      priority = VALUES(priority),
      is_active = 1;
  `;

  try {
    const [result] = await connection.execute(sql);
    console.log("✅ job_sources master data inserted/updated successfully");
    console.log(`ℹ️ Rows affected: ${result.affectedRows}`);
  } finally {
    await connection.end();
  }
}

insertJobSourcesMaster().catch((err) => {
  console.error("❌ Failed to insert job_sources master data");
  console.error(err);
  process.exit(1);
});
