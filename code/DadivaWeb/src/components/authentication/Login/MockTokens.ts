const mockTokenDonor =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJuaWMiOjEyMzQ1Njc4OSwicm9sZSI6IkRPTk9SIn0.l6rXhTe019aRIGbu8DRcvgsYfJ0VSgBNJioRXs3eu1U';

const mockTokenDoctor =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJuaWMiOjExMTExMTExMSwicm9sZSI6IkRPQ1RPUiJ9.b3iU5Kvvun7LXj5sTfADvXeYJzjmbizU1lqadADrbFs';

const mockTokenAdmin =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJuaWMiOjk4NzY1NDMyMSwicm9sZSI6IkFETUlOIn0.v08CZvQTbauBFiTs0AqgZ0QfUmpzaLVyzbWRzTkatl8';

export const TOKENS: Record<number, string> = {
  123456789: mockTokenDonor,
  111111111: mockTokenDoctor,
  987654321: mockTokenAdmin,
};
