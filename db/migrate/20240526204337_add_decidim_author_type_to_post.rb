class AddDecidimAuthorTypeToPost < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_posts, :decidim_author_type, :string
  end
end
