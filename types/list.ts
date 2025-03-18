 // 並び替えの基準キー
type SortType = 'updatedAt' | 'priority';

// 並び替えの順番
type OrderByDirection = 'asc' | 'desc';

// 並び替えPickerUIの選択値
type pickerChangeType = 'updatedAt:desc' | 'updatedAt:asc' | 'priority:desc' | 'priority:asc';

export type { SortType,OrderByDirection,pickerChangeType }
