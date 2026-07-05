import { TasksService } from './tasks.service';

describe('TasksService', () => {
  it('returns stable translation keys for UI-facing task copy', () => {
    const service = new TasksService();

    expect(service.getOverview()).toEqual({
      module: 'tasks',
      status: 'available',
      tasks: [
        {
          id: 'task-1',
          titleKey: 'tasks.items.reviewTemplate.title',
          descriptionKey: 'tasks.items.reviewTemplate.description',
          status: 'done',
        },
        {
          id: 'task-2',
          titleKey: 'tasks.items.addProductModule.title',
          descriptionKey: 'tasks.items.addProductModule.description',
          status: 'todo',
        },
      ],
    });
  });
});
