import { gql } from "@apollo/client";

// Auth
export const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

// Tasks
export const GET_TASKS = gql`
  query GetTasks($status: TaskStatus, $priority: TaskPriority) {
    tasks(status: $status, priority: $priority) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String
    $status: TaskStatus
    $priority: TaskPriority
    $dueDate: String
  ) {
    createTask(
      input: {
        title: $title
        description: $description
        status: $status
        priority: $priority
        dueDate: $dueDate
      }
    ) {
      id
      title
      description
      status
      priority
      dueDate
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: TaskStatus
    $priority: TaskPriority
    $dueDate: String
  ) {
    updateTask(
      input: {
        id: $id
        title: $title
        description: $description
        status: $status
        priority: $priority
        dueDate: $dueDate
      }
    ) {
      id
      title
      description
      status
      priority
      dueDate
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(input: { id: $id })
  }
`;
