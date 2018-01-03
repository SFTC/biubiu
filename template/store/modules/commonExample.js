import { searchMainList, createMain, getMainById } from '../../api';

export const NAMESPACE = '{{pageNameLower}}';

export const UPDATE_SEARCH = `UPDATE_SEARCH_${NAMESPACE}`;
export const UPDATE_RESULT = `UPDATE_RESULT_${NAMESPACE}`;
export const UPDATE_PAGINATION = `UPDATE_PAGINATION_${NAMESPACE}`;
export const UPDATE_MAIN_DIALOG_VISIBLE = `UPDATE_MAIN_DIALOG_VISIBLE_${NAMESPACE}`;
export const UPDATE_MAIN_DIALOG_DATA = `UPDATE_MAIN_DIALOG_DATA_${NAMESPACE}`;

const mainDialogDataInit = {
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: ['2', '3'],
  resource: '',
  desc: '',
};

const s = {
  // 设置搜索的默认条件
  searchCondition: {
    logisticsCenter: '',
    supplier: '',
    station: '',
    main: '',
    chineseName: '',
    phone: '',
  },
  searchResult: [],
  pagination: {
    total: null,
    current: 1,
    perpage: 50,
  },
  showMainDialog: false,
  mainDialogData: mainDialogDataInit,
};

const getters = {
};

const actions = {
  search({ commit, state }, params) {
    params = params || state.searchCondition;
    commit(UPDATE_SEARCH, params);
    return searchMainList(params).then((data) => {
      if (data.data && data.data.list) {
        commit(UPDATE_RESULT, data.data.list);
        commit(UPDATE_PAGINATION, {
          ...state.pagination,
          current: data.data.page || params.page,
          total: data.data.total,
        });
      }
    });
  },
  download({ commit, state }, params) {
    params = params || state.searchCondition;
    return searchMainList(params).then((data) => {
      if (data.errno === 0 || data.errno === '0') {
        return true;
      }
      return false;
    });
  },
  openMainDialog({ commit, state }, params) {
    commit(UPDATE_MAIN_DIALOG_VISIBLE, true);
    if (params) {
      commit(UPDATE_MAIN_DIALOG_DATA, params);
    }
  },
  getMainById({ commit }, id) {
    return getMainById({ id }).then((data) => {
      if (data.errno === 0 || data.errno === '0') {
        return data.data;
      }
      return false;
    });
  },
  closeMainDialog({ commit }) {
    commit(UPDATE_MAIN_DIALOG_VISIBLE, false);
    // 延迟重置数据，以使视觉上没有歧义；
    setTimeout(() => {
      commit(UPDATE_MAIN_DIALOG_DATA, mainDialogDataInit);
    }, 500);
  },
  createMain({ commit, state }, params) {
    return createMain(params).then((data) => {
      if (data.errno === 0 || data.errno === '0') {
        return true;
      }
      return false;
    });
  },
};

const mutations = {
  [UPDATE_SEARCH](state, payload) {
    state.searchCondition = payload;
  },
  [UPDATE_RESULT](state, payload) {
    state.searchResult = payload;
  },
  [UPDATE_PAGINATION](state, payload) {
    state.pagination = payload;
  },
  [UPDATE_MAIN_DIALOG_VISIBLE](state, payload) {
    state.showMainDialog = payload;
  },
  [UPDATE_MAIN_DIALOG_DATA](state, payload) {
    state.mainDialogData = payload;
  },
};

export default {
  namespaced: true,
  state: s,
  getters,
  actions,
  mutations,
};

