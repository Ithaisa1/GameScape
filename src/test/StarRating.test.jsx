/**
 * @file StarRating.test.jsx
 * @description Tests unitarios para el componente StarRating. Verifica el renderizado
 *              de estrellas, interactividad y cambios de calificación.
 * @module Test
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StarRating from '../components/StarRating/StarRating';

describe('StarRating', () => {
  it('renderiza 5 estrellas por defecto', () => {
    render(<StarRating />);
    
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  it('renderiza estrellas vacías cuando rating es 0', () => {
    render(<StarRating rating={0} />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveTextContent('☆');
    });
  });

  it('renderiza estrellas llenas según el rating', () => {
    render(<StarRating rating={3} />);
    
    const stars = screen.getAllByRole('button');
    expect(stars[0]).toHaveTextContent('⭐');
    expect(stars[1]).toHaveTextContent('⭐');
    expect(stars[2]).toHaveTextContent('⭐');
    expect(stars[3]).toHaveTextContent('☆');
    expect(stars[4]).toHaveTextContent('☆');
  });

  it('renderiza todas las estrellas llenas con rating 5', () => {
    render(<StarRating rating={5} />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveTextContent('⭐');
    });
  });

  it('llama a onRatingChange al hacer click en una estrella', () => {
    const onRatingChange = vi.fn();
    render(<StarRating rating={0} onRatingChange={onRatingChange} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]);
    
    expect(onRatingChange).toHaveBeenCalledWith(3);
  });

  it('desactiva el rating cuando readonly es true', () => {
    const onRatingChange = vi.fn();
    render(<StarRating rating={3} readonly onRatingChange={onRatingChange} />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toBeDisabled();
    });
    
    fireEvent.click(stars[0]);
    expect(onRatingChange).not.toHaveBeenCalled();
  });

  it('muestra el valor cuando showValue es true', () => {
    render(<StarRating rating={4} showValue />);
    
    expect(screen.getByText('4/5')).toBeInTheDocument();
  });

  it('muestra "Sin calificar" cuando rating es 0 y showValue es true', () => {
    render(<StarRating rating={0} showValue />);
    
    expect(screen.getByText('Sin calificar')).toBeInTheDocument();
  });

  it('no muestra el valor cuando showValue es false', () => {
    render(<StarRating rating={4} showValue={false} />);
    
    expect(screen.queryByText('4/5')).not.toBeInTheDocument();
  });

  it('aplica la clase de tamaño correcta', () => {
    const { container } = render(<StarRating size="large" />);
    
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('large');
  });

  it('resetea el rating al hacer click en la misma estrella', () => {
    const onRatingChange = vi.fn();
    render(<StarRating rating={3} onRatingChange={onRatingChange} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]);
    
    expect(onRatingChange).toHaveBeenCalledWith(0);
  });

  it('maneja hover en estrellas', () => {
    render(<StarRating rating={0} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.mouseEnter(stars[2]);
    
    expect(stars[0]).toHaveTextContent('⭐');
    expect(stars[1]).toHaveTextContent('⭐');
    expect(stars[2]).toHaveTextContent('⭐');
  });

  it('resetea el hover al salir del mouse', () => {
    render(<StarRating rating={0} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.mouseEnter(stars[2]);
    fireEvent.mouseLeave(stars[2]);
    
    expect(stars[0]).toHaveTextContent('☆');
    expect(stars[1]).toHaveTextContent('☆');
    expect(stars[2]).toHaveTextContent('☆');
  });
});
