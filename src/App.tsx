import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  WithAuthenticatorProps,
  Button,
  Heading,
  View,
  TextField,
  Flex,
  Text,
} from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

type Note = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

function App({ signOut }: WithAuthenticatorProps) {
  const [notes, setNotes] = useState([]);

  async function fetchNotes() {
    const apiData = (await API.graphql({
      query: listNotes,
    })) as GraphQLResult<any>;
    setNotes(apiData.data?.listNotes.items);
  }

  async function createNote(event: React.BaseSyntheticEvent) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
    };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id }: Note) {
    const newNotes = notes.filter((note: Note) => note.id !== id);
    setNotes(newNotes);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note: Note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.description}</Text>
            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
