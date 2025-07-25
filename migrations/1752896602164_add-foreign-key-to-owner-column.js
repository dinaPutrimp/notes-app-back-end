/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
  // mebuat user baru
  pgm.sql(`
        INSERT INTO users (id, username, password, fullname)
        VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')
    `);

  // mengubah nilai owner pada note yang owner nya null
  pgm.sql(`
        UPDATE notes
        SET owner = 'old_notes'
        WHERE owner IS NULL
    `);

  // menambahkan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint(
    "notes",
    "fk_notes.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint("notes", "fk_notes.owner_users.id");

  // menambah nilai owner old_notes pada note menjadi null
  pgm.sql(`UPDATE notes SET owner = NULL WHERE owner = 'old_notes'`);

  // menghapus user baru
  pgm.sql(`
        DELETE FROM users
        WHERE id = 'old_notes'
    `);
};

module.exports = {
  up,
  down,
};
