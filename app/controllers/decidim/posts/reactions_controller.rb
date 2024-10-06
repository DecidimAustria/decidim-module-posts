# frozen_string_literal: true

module Decidim
  module Posts
    class ReactionsController < Decidim::Components::BaseController
      before_action :authenticate_user!

      def create
        enforce_permission_to(:create, :reaction, resource:)

        reaction_type_id = params[:reaction_type_id]
        user_group_id = params[:user_group_id]

        AddReactionToResource.call(resource, current_user, user_group_id, reaction_type_id) do
          on(:ok) do
            resource.reload
            render partial: "update_buttons_and_counters", locals: { resource: resource }
            #render json: { success: true, reaction_type: @reaction.reaction_type }, status: :ok
          end

          on(:invalid) do
            render json: { error: I18n.t("resource_reactions.create.error", scope: "decidim") }, status: :unprocessable_entity
            #render json: { success: false, errors: @reaction.errors.full_messages }, status: :unprocessable_entity
          end
        end
      end

      def destroy
        enforce_permission_to(:withdraw, :reaction, resource:)
        
        user_group_id = params[:user_group_id]
        user_group = user_groups.find(user_group_id) if user_group_id

        RemoveReactionFromResource.call(resource, current_user, user_group) do
          on(:ok) do
            resource.reload
            render :update_buttons_and_counters
          end
        end
      end

      private

      def resource
        gid_param = params[:id] || params[:resource_id]
        @resource ||= GlobalID::Locator.locate(GlobalID.parse(gid_param))
      end

      def user_groups
        Decidim::UserGroups::ManageableUserGroups.for(current_user).verified
      end
    end
  end
end
