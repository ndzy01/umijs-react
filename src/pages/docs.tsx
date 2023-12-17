import { Button, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';

const DocsPage = ({ notes, loading, tags }: any) => {
  console.log('ndzy---log---ndzy', notes, '------');

  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'notes/initNotesAsync' });
    dispatch({ type: 'notes/initTagsAsync' });
  }, []);

  return (
    <div>
      {notes.map((item: any) => {
        return (
          <div key={item.id}>
            <button
            // onClick={() => {
            //   dispatch({
            //     type: 'notes/delTagAsync',
            //     payload: { id: item.id },
            //   });
            // }}
            >
              note:{item.title}
            </button>
          </div>
        );
      })}
      <Input
        style={{ width: 200 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        value={tagId}
        onChange={(v) => setTagId(v)}
        style={{ width: 200 }}
        options={tags.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}
      />
      <Button
        style={{ width: 100 }}
        onClick={() => {
          dispatch({
            type: 'notes/addNoteAsync',
            payload: { title: name, tagId },
          });
          setName('');
          setTagId('');
        }}
      >
        添加note
      </Button>
      <button
        onClick={() => {
          dispatch({
            type: 'notes/updateNoteAsync',
            payload: { id: 1, title: 'def' },
          });
        }}
      >
        update
      </button>
      <br />
      <button
        onClick={() => {
          dispatch({
            type: 'notes/addTagAsync',
            payload: { name: new Date().valueOf() },
          });
        }}
      >
        addTag
      </button>
      {tags.map((item: any) => {
        return (
          <div key={item.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'notes/delTagAsync',
                  payload: { id: item.id },
                });
              }}
            >
              delTag:{item.name}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default connect((s: any) => {
  return {
    notes: s.notes.notes,
    tags: s.notes.tags,
    loading: s.loading.global,
  };
})(DocsPage);
