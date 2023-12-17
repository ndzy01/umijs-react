import localforage from 'localforage';

export const noteStore = localforage.createInstance({
  name: 'noteStore',
  storeName: 'notes', // 数据存储的名字
});

export const tagStore = localforage.createInstance({
  name: 'tagStore',
  storeName: 'tags', // 数据存储的名字
});
