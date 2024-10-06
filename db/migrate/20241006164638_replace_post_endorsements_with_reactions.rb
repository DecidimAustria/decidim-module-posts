class ReplacePostEndorsementsWithReactions < ActiveRecord::Migration[6.1]
  def up
    # Add the reactions_count column
    add_column :decidim_posts_posts, :reactions_count, :integer, null: false, default: 0

    # Move the endorsements to reactions as likes
    like = Decidim::Posts::ReactionType.find_by(name: "like")
    Decidim::Posts::Post.all.each do |post|
      post.endorsements.each do |endorsement|
        post.reactions.create!(
          decidim_author: endorsement.decidim_author,
          decidim_user_group_id: endorsement.decidim_user_group_id,
          reaction_type: like
        )
        endorsement.destroy
      end
    end
    # Remove the endorsements_count column
    remove_column :decidim_posts_posts, :endorsements_count
  end

  def down
    # Add the endorsements_count column
    add_column :decidim_posts_posts, :endorsements_count, :integer, null: false, default: 0

    # Move the likes to endorsements
    like = Decidim::Posts::ReactionType.find_by(name: "like")
    Decidim::Posts::Post.all.each do |post|
      post.reactions.where(reaction_type: like).each do |reaction|
        post.endorsements.create!(
          decidim_author: reaction.decidim_author,
          decidim_user_group_id: reaction.decidim_user_group_id
        )
        reaction.destroy
      end
    end
    # Remove the reactions_count column
    remove_column :decidim_posts_posts, :reactions_count
  end
end
