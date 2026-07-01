import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { updateBrand } from '../src/lib/db';

dotenv.config();

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    console.error('FIREBASE_SERVICE_ACCOUNT missing');
    process.exit(1);
  }
}

async function main() {
  console.log('Testing updateBrand with slug "huehue"...');
  try {
    const res = await updateBrand('huehue', {
      name: 'HUEHUE TEST',
      targetAudience: {
        genders: { men: 50, women: 50 },
        socioEconomic: ["ab", "cplus"],
        regions: ["latam"],
        countries: ["Mexico"],
        excludedCountries: [],
        generations: ["millennials"]
      }
    });
    console.log('Success! Updated brand:', JSON.stringify(res, null, 2));
  } catch (err: any) {
    console.error('Error occurred during updateBrand:');
    console.error(err);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
