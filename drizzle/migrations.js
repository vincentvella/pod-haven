// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_slow_silver_fox.sql';
import m0001 from './0001_melodic_trish_tilby.sql';
import m0002 from './0002_young_boom_boom.sql';
import m0003 from './0003_lethal_frank_castle.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003
    }
  }
  