# frozen_string_literal: true

module Decidim
  module Posts
    # A command with all the business logic related with a user reacting to a resource.
    class AddReactionToResource < Decidim::Command
      # Public: Initializes the command.
      #
      # resource     - An instance of Decidim::Posts::Reactionable.
      # current_user - The current user.
      # current_group_id- (optional) The current_grup that is reacting to the Resource.
      # reaction_type_id - The id of the reaction type (emoji) that the user is reacting with.
      def initialize(resource, current_user, current_group_id = nil, reaction_type_id)
        @resource = resource
        @current_user = current_user
        @current_group_id = current_group_id
        @reaction_type = ReactionType.find(reaction_type_id)
      end

      # Executes the command. Broadcasts these events:
      #
      # - :ok when everything is valid, together with the resource reaction.
      # - :invalid if the form was not valid and we could not proceed.
      #
      # Returns nothing.
      def call
        return broadcast(:invalid) if existing_group_reaction?

        reaction = try_updating_reaction
        reaction = build_resource_reaction unless reaction
        if reaction.save
          notify_reactor_followers
          broadcast(:ok, reaction)
        else
          broadcast(:invalid)
        end
      rescue ActiveRecord::RecordNotUnique
        broadcast(:invalid)
      end

      private

      def existing_group_reaction?
        @current_group_id.present? && @resource.reactions.exists?(decidim_user_group_id: @current_group_id)
      end

      def try_updating_reaction
        reaction = @resource.reactions.find_by(author: @current_user)
        reaction.reaction_type = @reaction_type if reaction
        reaction
      end

      def build_resource_reaction
        reaction = @resource.reactions.build(author: @current_user, reaction_type: @reaction_type)
        reaction.user_group = user_groups.find(@current_group_id) if @current_group_id.present?
        reaction
      end

      def user_groups
        Decidim::UserGroups::ManageableUserGroups.for(@current_user).verified
      end

      def notify_reactor_followers
        Decidim::EventsManager.publish(
          event: "decidim.events.resource_reacted",
          event_class: Decidim::Posts::ResourceReactedEvent,
          resource: @resource,
          followers: @current_user.followers,
          extra: {
            reactor_id: @current_user.id
          }
        )
      end
    end
  end
end
