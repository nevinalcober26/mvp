'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { produce } from 'immer';

type Category = {
  id: UniqueIdentifier;
  name: string;
  parent: UniqueIdentifier | null;
  children: UniqueIdentifier[];
};

type Categories = Record<UniqueIdentifier, Category>;

const initialCategoriesData: Categories = {
  '1': { id: '1', name: 'Menu', parent: null, children: ['6', '7'] },
  '2': { id: '2', name: 'Special Offer', parent: null, children: [] },
  '3': { id: '3', name: 'About Us', parent: null, children: [] },
  '4': { id: '4', name: 'Contact Us', parent: null, children: [] },
  '5': { id: '5', name: 'Feedback Form', parent: null, children: [] },
  '6': { id: '6', name: 'Food', parent: '1', children: ['11', '12', '13', '15', '16', '17', '18', '19'] },
  '7': { id: '7', name: 'Beverages', parent: '1', children: [] },
  '11': { id: '11', name: 'Breakfast', parent: '6', children: [] },
  '12': { id: '12', name: 'Pancakes & French Toast', parent: '6', children: [] },
  '13': { id: '13', name: 'Keto & Vegan', parent: '6', children: [] },
  '15': { id: '15', name: 'Appetizers', parent: '6', children: [] },
  '16': { id: '16', name: 'Soups', parent: '6', children: [] },
  '17': { id: '17', name: 'Salads', parent: '6', children: [] },
  '18': { id: '18', name: 'Warm Bowls', parent: '6', children: [] },
  '19': { id: '19', name: 'Poke Bowls', parent: '6', children: [] },
};

function SortableCategoryItem({ id, category, depth = 0 }: { id: UniqueIdentifier, category: Category, depth?: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 2}rem`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-card border rounded-md p-2 flex items-center justify-between shadow-sm my-2">
      <div className="flex items-center gap-2">
        <button {...listeners} className="cursor-grab p-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        <span className="font-medium">{category.name}</span>
        {depth > 0 && <Badge variant="outline">sub item</Badge>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Custom Link</span>
        <Select defaultValue="custom-link">
            <SelectTrigger className="w-auto h-8 text-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="custom-link">Custom Link</SelectItem>
                <SelectItem value="elementor">Elementor</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function renderCategories(
  categories: Categories,
  categoryIds: UniqueIdentifier[],
  depth = 0
) {
  return categoryIds.map((id) => {
    const category = categories[id];
    if (!category) return null;
    return (
      <React.Fragment key={id}>
        <SortableCategoryItem id={id} category={category} depth={depth} />
        {category.children.length > 0 &&
          renderCategories(categories, category.children, depth + 1)}
      </React.Fragment>
    );
  });
}


export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Categories>(initialCategoriesData);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const rootCategoryIds = useMemo(() => Object.values(categories).filter(c => c.parent === null).map(c => c.id), [categories]);

  const flattenedIds = useMemo(() => {
    const ids: UniqueIdentifier[] = [];
    function flatten(categoryIds: UniqueIdentifier[]) {
      for (const id of categoryIds) {
        ids.push(id);
        if (categories[id]?.children.length) {
          flatten(categories[id].children);
        }
      }
    }
    flatten(rootCategoryIds);
    return ids;
  }, [categories, rootCategoryIds]);

  const findContainer = (id: UniqueIdentifier): UniqueIdentifier | null => {
    if (id in categories) {
      return categories[id].parent;
    }
     for (const key in categories) {
      if (categories[key].children.includes(id)) {
        return key;
      }
    }
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const id = active.id;
    const overId = over?.id;

    if (!overId || id === overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    
    // This logic handles dropping an item into another category (making it a child)
    // or dropping it within the same container to reorder.
    // For this example, we focus on reordering and parent changes on dragEnd.
    // A more complex handleDragOver could provide visual feedback for nesting.
  };


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
        setActiveId(null);
        return;
    }

    setCategories((prev) =>
        produce(prev, (draft) => {
            const activeId = active.id;
            const overId = over.id;

            const activeCategory = draft[activeId];
            const overCategory = draft[overId];

            if (!activeCategory || !overCategory) return;
            
            const oldParentId = activeCategory.parent;
            const oldParent = oldParentId ? draft[oldParentId] : null;

            // Find where the active item is
            const activeIndex = oldParent ? oldParent.children.indexOf(activeId) : rootCategoryIds.indexOf(activeId);

            // Remove from old parent/root
            if(oldParent) {
                oldParent.children.splice(activeIndex, 1);
            } else {
                 const rootIndex = Object.values(draft).filter(c => c.parent === null).map(c => c.id).indexOf(activeId);
                 if(rootIndex > -1){
                    // This is complex, we need a stable root array to splice from.
                    // For now, let's assume we can re-create it or filter it.
                 }
            }
            
            const newParentId = overCategory.parent;
            const newParent = newParentId ? draft[newParentId] : null;

            if (newParent) {
                 const overIndex = newParent.children.indexOf(overId);
                 newParent.children.splice(overIndex + 1, 0, activeId);
                 activeCategory.parent = newParentId;
            } else { // New parent is root
                const overIndex = Object.values(draft).filter(c => c.parent === null).map(c => c.id).indexOf(overId);
                 // Again, complex to insert into root. A better approach would be to have a single root node.
                 // For now, let's just push it to the new parent (if dropping ON a category)
                 // This part of the logic is simplified
                 overCategory.children.push(activeId);
                 activeCategory.parent = overId;
            }
        })
    );

    setActiveId(null);
  };
  
  const activeCategory = activeId ? categories[activeId] : null;

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 lg:px-8 justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          List of Categories
          <Badge variant="destructive">BLOOMSBURY'S (RAS AL KHAIMAH)</Badge>
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">PUBLISH</Button>
          <Select defaultValue="en">
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (EN)</SelectItem>
              <SelectItem value="es">Spanish (ES)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              CREATE CATEGORY
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <Select defaultValue="25">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Search:</span>
                <Input
                  type="search"
                  className="w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={flattenedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                 {renderCategories(categories, rootCategoryIds)}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeId && activeCategory ? (
                  <div className="bg-card border rounded-md p-2 flex items-center justify-between shadow-lg my-2">
                     <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{activeCategory.name}</span>
                     </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

          </CardContent>
        </Card>
      </main>
    </>
  );
}
