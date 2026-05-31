import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'PENDING' as const,
  priority: 'HIGH' as const,
  dueDate: '2023-12-31T00:00:00.000Z',
  createdAt: '2023-12-01T00:00:00.000Z',
  updatedAt: '2023-12-01T00:00:00.000Z',
};

describe('TaskCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('● HIGH')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onStatusChange when status is changed', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const statusSelect = screen.getByDisplayValue('⏳ Pending');
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } });
    expect(mockOnStatusChange).toHaveBeenCalledWith('COMPLETED');
  });
});
