import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';

describe('FilterBar', () => {
  it('renders correctly', () => {
    const mockOnChange = jest.fn();
    render(<FilterBar filters={{}} onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Priority')).toBeInTheDocument();
  });

  it('calls onChange when status is changed', () => {
    const mockOnChange = jest.fn();
    render(<FilterBar filters={{}} onChange={mockOnChange} />);
    
    const statusSelect = screen.getByDisplayValue('All Status');
    fireEvent.change(statusSelect, { target: { value: 'PENDING' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({ status: 'PENDING' });
  });

  it('calls onChange when priority is changed', () => {
    const mockOnChange = jest.fn();
    render(<FilterBar filters={{}} onChange={mockOnChange} />);
    
    const prioritySelect = screen.getByDisplayValue('All Priority');
    fireEvent.change(prioritySelect, { target: { value: 'HIGH' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({ priority: 'HIGH' });
  });
});
