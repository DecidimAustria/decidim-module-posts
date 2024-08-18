class AddCommentsCountToPost < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_posts, :comments_count, :integer, null: false, default: 0, index: true
    Decidim::Posts::Post.reset_column_information
    Decidim::Posts::Post.find_each(&:update_comments_count)
  end
end
