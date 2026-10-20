import { expect, test } from '@playwright/test';

const { E2E_EMAIL, E2E_PASSWORD } = process.env;

test('un administrador crea un curso y lo ve en la lista', async ({ page }) => {
  test.skip(!E2E_EMAIL || !E2E_PASSWORD, 'Define E2E_EMAIL y E2E_PASSWORD (usuario ADMINISTRATOR)');
  const courseName = `Angular E2E ${Date.now()}`;

  // Dado un usuario ADMINISTRATOR autenticado
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(E2E_EMAIL!);
  await page.getByLabel('Password', { exact: true }).fill(E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/courses$/);

  // Cuando envía el formulario de curso con datos válidos
  await page.getByRole('button', { name: 'Add course' }).click();
  const modal = page.getByRole('dialog', { name: 'New course' });
  await modal.getByLabel('Name').fill(courseName);
  await modal.getByLabel('Duration (hours)').fill('12');
  await modal.getByLabel('Level').selectOption('BEGINNER');
  await modal.getByLabel('Category').selectOption('PROGRAMMING');
  await modal.getByLabel('Instructor').selectOption({ index: 1 }); // primer instructor real
  await modal.getByRole('button', { name: 'Create course' }).click();

  // Entonces el modal se cierra y el curso aparece en la lista
  await expect(modal).toBeHidden();
  await expect(page.getByRole('row', { name: new RegExp(courseName) })).toBeVisible();
});
