import { noteStore, tagStore } from '@/utils/localForageConfig';
import dayjs from 'dayjs';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const loadNotes = async () => {
  const storedNotes: any = (await noteStore.getItem('notes')) || [];
  const tags: any = await tagStore.getItem('tags');

  return storedNotes.map((item: any) => {
    return {
      ...item,
      tagName: tags.find((tag: any) => tag.id === item.tagId).name,
    };
  });
};

const addNote = async (currentNotes: any[], note: any) => {
  if (currentNotes.find((item) => item.id === note.id)) {
    return false;
  }

  const allNotes = [
    ...currentNotes,
    {
      ...note,
      createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  await noteStore.setItem('notes', allNotes);

  return allNotes;
};

const updateNote = async (currentNotes: any[], note: any) => {
  if (currentNotes.find((item) => item.id !== note.id)) {
    return false;
  }

  const allNotes = currentNotes.map((item) => {
    if (item.id === note.id) {
      return {
        ...item,
        ...note,
        updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
    }
  });

  await noteStore.setItem('notes', allNotes);

  return allNotes;
};
// ----
const loadTags = async () => {
  const tags: any = (await tagStore.getItem('tags')) || [];

  return tags;
};

const addTag = async (currentTags: any[], tag: any) => {
  const allTags = [
    ...currentTags,
    {
      ...tag,
      createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  await tagStore.setItem('tags', allTags);

  return allTags;
};

const delTag = async (currentTags: any[], tag: any) => {
  const allTags = currentTags.filter((item) => item.id !== tag.id);

  await tagStore.setItem('tags', allTags);

  return allTags;
};

export default {
  namespace: 'notes',
  state: {
    notes: [],
    tags: [],
  },
  reducers: {
    updateNotes(state: any, { payload }: any) {
      return {
        ...state,
        notes: payload,
      };
    },
    updateTags(state: any, { payload }: any) {
      return {
        ...state,
        tags: payload,
      };
    },
  },
  effects: {
    *initNotesAsync(_action: any, { put, call }: any) {
      const res = yield call(loadNotes);

      if (res) {
        yield put({ type: 'updateNotes', payload: res });
      }
    },

    *addNoteAsync(action: any, { select, put, call }: any) {
      const state: any = yield select((state: any) => state.notes);
      const res = yield call(addNote, state.notes, {
        id: generateUUID(),
        ...action.payload,
      });

      if (res) {
        yield put({ type: 'updateNotes', payload: res });
      }
    },

    *updateNoteAsync(action: any, { select, put, call }: any) {
      const state: any = yield select((state: any) => state.notes);
      const res = yield call(updateNote, state.notes, action.payload);

      if (res) {
        yield put({ type: 'updateNotes', payload: res });
      }
    },

    *initTagsAsync(_action: any, { put, call }: any) {
      const res = yield call(loadTags);

      if (res) {
        yield put({ type: 'updateTags', payload: res });
      }
    },

    *addTagAsync(action: any, { select, put, call }: any) {
      const state: any = yield select((state: any) => state.notes);
      const res = yield call(addTag, state.tags, {
        id: generateUUID(),
        ...action.payload,
      });

      if (res) {
        yield put({ type: 'updateTags', payload: res });
      }
    },

    *delTagAsync(action: any, { select, put, call }: any) {
      const state: any = yield select((state: any) => state.notes);
      const res = yield call(delTag, state.tags, action.payload);

      if (res) {
        yield put({ type: 'updateTags', payload: res });
      }
    },
  },
};
