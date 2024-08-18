class AddEndorsementsCountToPost < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_posts, :endorsements_count, :integer, null: false, default: 0
  end
end
