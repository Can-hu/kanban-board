export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  column: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}