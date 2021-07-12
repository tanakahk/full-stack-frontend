import { reactive, readonly } from 'vue';
// import axios from 'axios';

export interface Sr {
  id: number
  url: string
  atk: number
  hp: number
  def: number
  cost: number
  sp: number
  cooldown: number
  price: number
}

export interface FrameState {
  busy: boolean
  // srUrl: string[]
  sr: Sr[]
  mySr: Sr[]
  srCurrent: number
  defaultSrUrl: string
  srFirstTimeLoaded: boolean
}

const state: FrameState = reactive({
  busy: false,
  // srUrl: [],
  sr: [],
  mySr: [],
  srCurrent: 0,
  defaultSrUrl: 'https://github.com/Nayuta-Kani/SAOIF-Skill-Records-Database/blob/master/srimages/sr_icon_l_6100',
  srFirstTimeLoaded: false,
});

const mutations = {
  setBusy(value: boolean) {
    state.busy = value;
    if (value === true) {
      console.log('Estou ocupado');
    } else {
      console.log('Estou disponível');
    }
    return true;
  },

  setSr(sr: Sr) {
    const idx = state.sr.findIndex((s) => s.id === sr.id);
    if (idx > -1) {
      state.sr[idx] = sr;
    } else {
      state.sr.push(sr);
    }
    return true;
  },

  buySr(sr: Sr) {
      state.mySr.push(sr);
  },

  srFirstTimeLoaded(firstTime: boolean) {
    state.srFirstTimeLoaded = firstTime;
  },
};

const actions = {
  async loadSr(count: number, firstTime: boolean) {
    mutations.setBusy(true);

    if (firstTime) {
      // eslint-disable-next-line no-param-reassign
      count++;
    }

    for (let i = 1; i <= count; i++) {
      let srId = '';
      let res = '';
      if (state.srCurrent < 10) {
        srId = srId.concat('00', state.srCurrent.toString());
      }
      if (state.srCurrent >= 10 && state.srCurrent < 100) {
        srId = srId.concat('0', state.srCurrent.toString());
      }
      if (state.srCurrent >= 100) {
        srId = state.srCurrent.toString();
      }

      res = res.concat(`${state.defaultSrUrl}`, srId, '.png?raw=true');

      const idNumber = parseInt(res.slice(91, 98), 10);

      const sr: Sr = {
        id: idNumber,
        url: res,
        atk: actions.generateRandomNumber(20, 70),
        hp: actions.generateRandomNumber(50, 3500),
        def: actions.generateRandomNumber(30, 80),
        cost: actions.generateRandomNumber(5, 45),
        sp: actions.generateRandomNumber(10, 50),
        cooldown: actions.generateRandomNumber(4, 30),
        price: actions.generateRandomNumber(100, 10000),
      };

      mutations.setSr(sr);
      state.srCurrent++;
    }

    if (firstTime) {
      state.sr.shift();
    }

    mutations.setBusy(false);
    return true;
  },

  async loadMySr() {
    const key = 'saoifSrStore';
    const sr = localStorage.getItem(key);
    if (sr) {
      state.mySr = JSON.parse(sr);
    }
  },

  generateRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  async buySr(sr: Sr) {
    console.log('comprando', sr);

    mutations.buySr(sr);

    const key = 'saoifSrStore';
    localStorage.setItem(key, JSON.stringify(state.mySr));
  },

  async sellSr(sr: Sr) {
    console.log('vendendo', sr);
  },
};

export default function useFrame(): Readonly<any> {
  return readonly({
    state,
    mutations,
    actions,
  });
}
