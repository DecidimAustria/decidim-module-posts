class CreateDecidimPostsReactions < ActiveRecord::Migration[6.1]
  def up
    create_table :decidim_posts_reaction_types do |t|
      t.string :name, null: false
      t.string :icon_name, null: false
      t.integer :position, null: false, default: 0
    end

    create_table :decidim_posts_reactions do |t|
      t.references :resource, null: false, polymorphic: true
      t.references :decidim_author, null: false, polymorphic: true, index: { name: "idx_decidim_posts_reactions_authors" }
      t.integer :decidim_user_group_id, null: false, default: 0, foreign_key: true
      t.references :reaction_type, null: false

      t.timestamps

      t.index [:decidim_author_id, :decidim_author_type, :resource_id, :resource_type, :decidim_user_group_id], name: "idx_decidim_posts_reactions_unique", unique: true
    end

    # Add some default reaction types
    reaction_types = [
      { name: "love", icon_name: "heart", position: 1 },
      { name: "laugh", icon_name: "laugh", position: 2 },
      { name: "wow", icon_name: "surprise", position: 3 },
      { name: "sad", icon_name: "sad", position: 4 },
      { name: "angry", icon_name: "angry", position: 5 },
      { name: "like", icon_name: "like", position: 6 }
    ]

    reaction_types.each do |reaction_type|
      Decidim::Posts::ReactionType.create!(reaction_type)
    end
  end

  def down
    drop_table :decidim_posts_reactions
    drop_table :decidim_posts_reaction_types
  end
end
