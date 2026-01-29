'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from './Item';
import { UniqueIdentifier } from '@dnd-kit/core';

type SortableItemProps = {
  id: UniqueIdentifier;
  name: string;
  onClick: () => void;
};

export function SortableItem({ id, name, onClick }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Item id={id} name={name} onClick={onClick} />
    </div>
  );
}
