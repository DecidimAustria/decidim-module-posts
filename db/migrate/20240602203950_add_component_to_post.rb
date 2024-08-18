class AddComponentToPost < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_posts, :decidim_component_id, :integer
    remove_column :decidim_posts_posts, :organization_id, :integer
  end
end
